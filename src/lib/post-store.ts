import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { and, eq } from "drizzle-orm";
import { postLinks, postTags, posts, publishLogs, tags } from "../../drizzle/schema";
import { db } from "./db";
import {
  FrontmatterError,
  parseMarkdownPost,
  serializeMarkdownPost,
  collectPostTags,
  type ParsedMarkdownPost,
  type PostMetadata
} from "./markdown";
import { parseWikilinks } from "./graph";

const postsRoot = path.join(process.cwd(), "content", "posts");
const postPathPattern = /^\d{4}\/\d{2}\/[^/]+\.md$/;

export interface PostRecord extends ParsedMarkdownPost {
  filePath: string;
}

export interface CreateDraftPostInput {
  title: string;
  slug: string;
  description: string;
  markdown: string;
  tags?: string[];
  series?: string | null;
  canonical?: string | null;
  ogImage?: string | null;
}

export interface AdminPostResult {
  slug: string;
  status: "draft" | "published" | "archived";
  markdownPath: string;
}

export interface UpdatePostInput {
  title?: string;
  description?: string;
  markdown?: string;
  tags?: string[];
  series?: string | null;
  canonical?: string | null;
  ogImage?: string | null;
}

export interface LinkedPostSummary {
  slug: string;
  title: string;
  description: string | null;
}

export function getPostFilePath(year: string, month: string, filename: string): string {
  if (!/^\d{4}$/.test(year) || !/^\d{2}$/.test(month) || !/^[a-z0-9][a-z0-9-]*\.md$/.test(filename)) {
    throw new Error("Invalid post file path");
  }

  return path.join(postsRoot, year, month, filename);
}

export async function readMarkdownPost(filePath: string): Promise<PostRecord> {
  const relativePath = path.relative(postsRoot, filePath).split(path.sep).join("/");

  if (relativePath.startsWith("..") || !postPathPattern.test(relativePath)) {
    throw new Error(`Invalid post file path: ${relativePath}`);
  }

  const source = await readFile(filePath, "utf8");
  const parsed = parseMarkdownPost(source);

  return {
    ...parsed,
    filePath
  };
}

export async function listMarkdownPosts(): Promise<PostRecord[]> {
  const filePaths = await listPostFiles(postsRoot);
  const results = await Promise.allSettled(filePaths.map((filePath) => readMarkdownPost(filePath)));
  const posts = results.flatMap((result) => {
    if (result.status === "fulfilled") {
      return [result.value];
    }

    if (result.reason instanceof FrontmatterError) {
      console.warn(result.reason.message);
      return [];
    }

    throw result.reason;
  });

  return sortPosts(posts);
}

export async function listPublishedPosts(): Promise<PostRecord[]> {
  const posts = await listMarkdownPosts();

  return posts.filter((post) => post.metadata.status === "published");
}

export async function getPostBySlug(slug: string): Promise<PostRecord | null> {
  const posts = await listMarkdownPosts();

  return posts.find((post) => post.metadata.slug === slug) ?? null;
}

export async function getPublishedPostBySlug(slug: string): Promise<PostRecord | null> {
  const post = await getPostBySlug(slug);

  return post?.metadata.status === "published" ? post : null;
}

export async function listPublishedPostsByTag(tag: string): Promise<PostRecord[]> {
  const posts = await listPublishedPosts();
  const normalizedTag = tag.toLowerCase();

  return posts.filter((post) =>
    post.metadata.tags.some((postTag) => postTag.toLowerCase() === normalizedTag)
  );
}

export async function listPublishedPostsBySeries(series: string): Promise<PostRecord[]> {
  const posts = await listPublishedPosts();
  const normalizedSeries = series.toLowerCase();

  return posts.filter((post) => post.metadata.series?.toLowerCase() === normalizedSeries);
}

export async function createDraftPost(input: CreateDraftPostInput): Promise<AdminPostResult> {
  const normalized = normalizeCreateDraftInput(input);
  const duplicate = await db.query.posts.findFirst({
    where: eq(posts.slug, normalized.slug)
  });

  if (duplicate) {
    throw new Error("Post slug already exists");
  }

  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const markdownPath = getPostFilePath(String(now.getUTCFullYear()), padMonth(now.getUTCMonth() + 1), `${normalized.slug}.md`);

  await assertFileDoesNotExist(markdownPath);

  const tags = collectPostTags(normalized.tags, normalized.markdown);
  const metadata: PostMetadata = {
    slug: normalized.slug,
    title: normalized.title,
    description: normalized.description,
    date,
    updated: date,
    status: "draft",
    tags,
    series: normalized.series,
    canonical: normalized.canonical,
    ogImage: normalized.ogImage
  };

  await mkdir(path.dirname(markdownPath), { recursive: true });
  await writeFile(markdownPath, serializeMarkdownPost(metadata, normalized.markdown), "utf8");

  const relativeMarkdownPath = path.relative(process.cwd(), markdownPath).split(path.sep).join("/");
  const [post] = await db
    .insert(posts)
    .values({
      slug: metadata.slug,
      title: metadata.title,
      description: metadata.description,
      markdownPath: relativeMarkdownPath,
      status: "draft",
      series: metadata.series,
      canonicalUrl: metadata.canonical,
      ogImage: metadata.ogImage
    })
    .returning({ id: posts.id, slug: posts.slug, status: posts.status, markdownPath: posts.markdownPath });

  await syncPostTags(post.id, metadata.tags);
  await syncPostLinks(post.id, metadata.slug, normalized.markdown);

  return {
    slug: post.slug,
    status: post.status,
    markdownPath: post.markdownPath
  };
}

export async function updatePost(slug: string, input: UpdatePostInput): Promise<AdminPostResult> {
  const existing = await db.query.posts.findFirst({
    where: eq(posts.slug, slug)
  });

  if (!existing) {
    throw new Error("Post not found");
  }

  const filePath = path.join(process.cwd(), existing.markdownPath);
  const current = await readMarkdownPost(filePath);
  const updatedDate = new Date().toISOString().slice(0, 10);
  const metadata: PostMetadata = {
    ...current.metadata,
    title: input.title === undefined ? current.metadata.title : normalizeRequiredString(input.title, "title"),
    description:
      input.description === undefined
        ? current.metadata.description
        : normalizeRequiredString(input.description, "description"),
    updated: updatedDate,
    tags: collectPostTags(
      input.tags === undefined ? current.metadata.tags : normalizeTagsInput(input.tags),
      input.markdown === undefined ? current.body : normalizeRequiredString(input.markdown, "markdown")
    ),
    series: input.series === undefined ? current.metadata.series : normalizeNullableString(input.series),
    canonical:
      input.canonical === undefined ? current.metadata.canonical : normalizeNullableString(input.canonical),
    ogImage: input.ogImage === undefined ? current.metadata.ogImage : normalizeNullableString(input.ogImage)
  };
  const markdown = input.markdown === undefined ? current.body : normalizeRequiredString(input.markdown, "markdown");

  await writeFile(filePath, serializeMarkdownPost(metadata, markdown), "utf8");
  const [post] = await db
    .update(posts)
    .set({
      title: metadata.title,
      description: metadata.description,
      series: metadata.series,
      canonicalUrl: metadata.canonical,
      ogImage: metadata.ogImage,
      updatedAt: new Date()
    })
    .where(eq(posts.slug, slug))
    .returning({ id: posts.id, slug: posts.slug, status: posts.status, markdownPath: posts.markdownPath });

  await db.delete(postTags).where(eq(postTags.postId, post.id));
  await syncPostTags(post.id, metadata.tags);
  await syncPostLinks(post.id, metadata.slug, markdown);

  return {
    slug: post.slug,
    status: post.status,
    markdownPath: post.markdownPath
  };
}

export async function listBacklinks(targetSlug: string): Promise<LinkedPostSummary[]> {
  return db
    .select({
      slug: posts.slug,
      title: posts.title,
      description: posts.description
    })
    .from(postLinks)
    .innerJoin(posts, eq(postLinks.sourcePostId, posts.id))
    .where(and(eq(postLinks.targetSlug, targetSlug), eq(posts.status, "published")));
}

export async function publishPost(slug: string): Promise<AdminPostResult> {
  const existing = await db.query.posts.findFirst({
    where: eq(posts.slug, slug)
  });

  if (!existing) {
    throw new Error("Post not found");
  }

  if (existing.status === "published") {
    throw new Error("Post is already published");
  }

  if (existing.status !== "draft") {
    throw new Error("Only draft posts can be published");
  }

  const filePath = path.join(process.cwd(), existing.markdownPath);
  const current = await readMarkdownPost(filePath);
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const metadata: PostMetadata = {
    ...current.metadata,
    status: "published",
    date: current.metadata.date || date,
    updated: date
  };

  await writeFile(filePath, serializeMarkdownPost(metadata, current.body), "utf8");
  const [post] = await db
    .update(posts)
    .set({
      status: "published",
      publishedAt: now,
      updatedAt: now
    })
    .where(eq(posts.slug, slug))
    .returning({ id: posts.id, slug: posts.slug, status: posts.status, markdownPath: posts.markdownPath });

  await db.insert(publishLogs).values({
    postId: post.id,
    postSlug: post.slug,
    action: "published",
    metadata: { source: "admin_api" }
  });

  return {
    slug: post.slug,
    status: post.status,
    markdownPath: post.markdownPath
  };
}

export async function archivePost(slug: string): Promise<AdminPostResult> {
  const existing = await db.query.posts.findFirst({
    where: eq(posts.slug, slug)
  });

  if (!existing) {
    throw new Error("Post not found");
  }

  const filePath = path.join(process.cwd(), existing.markdownPath);
  const current = await readMarkdownPost(filePath);
  const now = new Date();
  const metadata: PostMetadata = {
    ...current.metadata,
    status: "archived",
    updated: now.toISOString().slice(0, 10)
  };

  await writeFile(filePath, serializeMarkdownPost(metadata, current.body), "utf8");
  const [post] = await db
    .update(posts)
    .set({
      status: "archived",
      updatedAt: now
    })
    .where(eq(posts.slug, slug))
    .returning({ id: posts.id, slug: posts.slug, status: posts.status, markdownPath: posts.markdownPath });

  await db.insert(publishLogs).values({
    postId: post.id,
    postSlug: post.slug,
    action: "archived",
    metadata: { source: "admin_api", physicalDelete: false }
  });

  return {
    slug: post.slug,
    status: post.status,
    markdownPath: post.markdownPath
  };
}

async function listPostFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return listPostFiles(entryPath);
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        return [entryPath];
      }

      return [];
    })
  );

  return files.flat();
}

function sortPosts(posts: PostRecord[]): PostRecord[] {
  return [...posts].sort((a, b) => {
    const byDate = b.metadata.date.localeCompare(a.metadata.date);

    if (byDate !== 0) {
      return byDate;
    }

    return a.metadata.title.localeCompare(b.metadata.title);
  });
}

function normalizeCreateDraftInput(input: CreateDraftPostInput): Required<CreateDraftPostInput> {
  const title = normalizeRequiredString(input.title, "title");
  const slug = normalizeSlug(input.slug);
  const description = normalizeRequiredString(input.description, "description");
  const markdown = normalizeRequiredString(input.markdown, "markdown");
  const tags = normalizeTagsInput(input.tags ?? []);

  return {
    title,
    slug,
    description,
    markdown,
    tags,
    series: normalizeNullableString(input.series),
    canonical: normalizeNullableString(input.canonical),
    ogImage: normalizeNullableString(input.ogImage)
  };
}

function normalizeRequiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid field: ${field}`);
  }

  return value.trim();
}

function normalizeTagsInput(value: unknown): string[] {
  if (!Array.isArray(value)) {
    throw new Error("Invalid field: tags");
  }

  return Array.from(new Set(value.map((tag) => normalizeRequiredString(tag, "tags"))));
}

function normalizeNullableString(value: unknown): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("Invalid nullable string field");
  }

  return value.trim();
}

function normalizeSlug(value: unknown): string {
  const slug = normalizeRequiredString(value, "slug");

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Invalid field: slug");
  }

  return slug;
}

function slugifyTag(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, "");
}

async function assertFileDoesNotExist(filePath: string): Promise<void> {
  try {
    await access(filePath);
  } catch {
    return;
  }

  throw new Error("Post markdown file already exists");
}

function padMonth(month: number): string {
  return String(month).padStart(2, "0");
}

async function syncPostTags(postId: string, tagNames: string[]): Promise<void> {
  for (const tagName of tagNames) {
    const tagSlug = slugifyTag(tagName);
    const [tag] = await db
      .insert(tags)
      .values({ name: tagName, slug: tagSlug })
      .onConflictDoUpdate({
        target: tags.slug,
        set: { name: tagName }
      })
      .returning({ id: tags.id });

    await db
      .insert(postTags)
      .values({ postId, tagId: tag.id })
      .onConflictDoNothing();
  }
}

async function syncPostLinks(postId: string, sourceSlug: string, markdown: string): Promise<void> {
  await db.delete(postLinks).where(eq(postLinks.sourcePostId, postId));

  for (const link of parseWikilinks(markdown)) {
    if (link.targetSlug === sourceSlug) {
      continue;
    }

    const targetPost = await db.query.posts.findFirst({
      where: eq(posts.slug, link.targetSlug)
    });

    await db.insert(postLinks).values({
      sourcePostId: postId,
      targetPostId: targetPost?.id,
      targetSlug: link.targetSlug,
      linkType: "wikilink",
      rawText: link.rawText,
      displayText: link.displayText
    });
  }
}
