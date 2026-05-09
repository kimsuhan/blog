import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { FrontmatterError, parseMarkdownPost, type ParsedMarkdownPost } from "./markdown";

const postsRoot = path.join(process.cwd(), "content", "posts");
const postPathPattern = /^\d{4}\/\d{2}\/[^/]+\.md$/;

export interface PostRecord extends ParsedMarkdownPost {
  filePath: string;
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
