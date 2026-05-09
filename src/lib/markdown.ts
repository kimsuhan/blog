import matter from "gray-matter";
import { marked } from "marked";

export const postStatuses = ["draft", "published", "archived"] as const;

export type PostStatus = (typeof postStatuses)[number];

export interface PostMetadata {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  status: PostStatus;
  tags: string[];
  series: string | null;
  canonical: string | null;
  ogImage: string | null;
}

export interface ParsedMarkdownPost {
  metadata: PostMetadata;
  body: string;
}

export class FrontmatterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FrontmatterError";
  }
}

export function parseMarkdownPost(source: string): ParsedMarkdownPost {
  const parsed = matter(source);

  return {
    metadata: normalizePostMetadata(parsed.data),
    body: parsed.content.trim()
  };
}

export function renderMarkdown(body: string): string {
  return marked.parse(body, {
    async: false,
    gfm: true
  });
}

function normalizePostMetadata(data: Record<string, unknown>): PostMetadata {
  const title = requiredString(data.title, "title");
  const slug = requiredString(data.slug, "slug");
  const description = requiredString(data.description, "description");
  const date = requiredDateString(data.date ?? data.publishedAt, "date");
  const updated = requiredDateString(data.updated ?? data.updatedAt ?? date, "updated");
  const status = normalizeStatus(data.status);

  return {
    slug,
    title,
    description,
    date,
    updated,
    status,
    tags: normalizeTags(data.tags),
    series: optionalString(data.series, "series"),
    canonical: optionalString(data.canonical, "canonical"),
    ogImage: optionalString(data.ogImage, "ogImage")
  };
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new FrontmatterError(`Missing or invalid frontmatter field: ${field}`);
  }

  return value.trim();
}

function optionalString(value: unknown, field: string): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new FrontmatterError(`Invalid frontmatter field: ${field}`);
  }

  return value.trim();
}

function requiredDateString(value: unknown, field: string): string {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value !== "string" || value.trim() === "") {
    throw new FrontmatterError(`Missing or invalid frontmatter field: ${field}`);
  }

  const normalized = value.trim();
  if (Number.isNaN(Date.parse(normalized))) {
    throw new FrontmatterError(`Invalid date frontmatter field: ${field}`);
  }

  return normalized;
}

function normalizeStatus(value: unknown): PostStatus {
  if (typeof value !== "string" || !isPostStatus(value)) {
    throw new FrontmatterError("Invalid frontmatter field: status");
  }

  return value;
}

function normalizeTags(value: unknown): string[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new FrontmatterError("Invalid frontmatter field: tags");
  }

  return value.map((tag) => {
    if (typeof tag !== "string" || tag.trim() === "") {
      throw new FrontmatterError("Invalid frontmatter field: tags");
    }

    return tag.trim();
  });
}

export function isPostStatus(value: string): value is PostStatus {
  return postStatuses.includes(value as PostStatus);
}
