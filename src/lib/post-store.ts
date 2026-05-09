import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseMarkdownPost, type ParsedMarkdownPost } from "./markdown";

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
  const posts = await Promise.all(filePaths.map((filePath) => readMarkdownPost(filePath)));

  return posts.sort((a, b) => b.metadata.date.localeCompare(a.metadata.date));
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
