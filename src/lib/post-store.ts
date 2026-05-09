import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { postTags, posts, tags } from "../../drizzle/schema";
import { db } from "./db";
import {
  FrontmatterError,
  parseMarkdownPost,
  serializeMarkdownPost,
  type ParsedMarkdownPost,
  type PostMetadata
} from "./markdown";

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

  const metadata: PostMetadata = {
    slug: normalized.slug,
    title: normalized.title,
    description: normalized.description,
    date,
    updated: date,
    status: "draft",
    tags: normalized.tags,
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

  for (const tagName of metadata.tags) {
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
      .values({ postId: post.id, tagId: tag.id })
      .onConflictDoNothing();
  }

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
  const tags = Array.from(new Set((input.tags ?? []).map((tag) => normalizeRequiredString(tag, "tags"))));

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
