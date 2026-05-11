import { and, desc, eq, sql } from "drizzle-orm";
import { postSearchIndex, posts } from "../../drizzle/schema";
import { db } from "./db";
import type { PostMetadata } from "./markdown";

export interface SearchIndexPost {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: "draft" | "published" | "archived";
  series: string | null;
}

export interface SearchResult {
  slug: string;
  title: string;
  description: string | null;
  series: string | null;
  tags: string[];
  excerpt: string;
  rank: number;
}

export async function syncPostSearchIndex(
  post: SearchIndexPost,
  metadata: PostMetadata,
  markdown: string
): Promise<void> {
  if (post.status !== "published") {
    await removePostSearchIndex(post.id);
    return;
  }

  const titleText = metadata.title || post.title;
  const bodyText = extractSearchText(markdown);
  const tagText = metadata.tags.join(" ");
  const seriesText = metadata.series ?? post.series ?? "";
  const searchText = [titleText, metadata.description, bodyText, tagText, seriesText]
    .filter(Boolean)
    .join("\n");

  await db
    .insert(postSearchIndex)
    .values({
      postId: post.id,
      slug: post.slug,
      titleText,
      bodyText,
      tagText,
      seriesText,
      searchText,
      searchVector: sql`
        setweight(to_tsvector('simple', ${titleText}), 'A') ||
        setweight(to_tsvector('simple', ${metadata.description}), 'B') ||
        setweight(to_tsvector('simple', ${tagText}), 'B') ||
        setweight(to_tsvector('simple', ${seriesText}), 'C') ||
        setweight(to_tsvector('simple', ${bodyText}), 'D')
      `,
      indexedAt: new Date()
    })
    .onConflictDoUpdate({
      target: postSearchIndex.postId,
      set: {
        slug: post.slug,
        titleText,
        bodyText,
        tagText,
        seriesText,
        searchText,
        searchVector: sql`
          setweight(to_tsvector('simple', ${titleText}), 'A') ||
          setweight(to_tsvector('simple', ${metadata.description}), 'B') ||
          setweight(to_tsvector('simple', ${tagText}), 'B') ||
          setweight(to_tsvector('simple', ${seriesText}), 'C') ||
          setweight(to_tsvector('simple', ${bodyText}), 'D')
        `,
        indexedAt: new Date()
      }
    });
}

export async function removePostSearchIndex(postId: string): Promise<void> {
  await db.delete(postSearchIndex).where(eq(postSearchIndex.postId, postId));
}

export async function searchPublishedPosts(query: string, limit = 20): Promise<SearchResult[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const rows = await db
    .select({
      slug: postSearchIndex.slug,
      title: posts.title,
      description: posts.description,
      series: posts.series,
      tagText: postSearchIndex.tagText,
      bodyText: postSearchIndex.bodyText,
      rank: sql<number>`ts_rank_cd(${postSearchIndex.searchVector}, plainto_tsquery('simple', ${normalizedQuery}))`
    })
    .from(postSearchIndex)
    .innerJoin(posts, eq(postSearchIndex.postId, posts.id))
    .where(
      and(
        eq(posts.status, "published"),
        sql`${postSearchIndex.searchVector} @@ plainto_tsquery('simple', ${normalizedQuery})`
      )
    )
    .orderBy(desc(sql`ts_rank_cd(${postSearchIndex.searchVector}, plainto_tsquery('simple', ${normalizedQuery}))`))
    .limit(limit);

  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    series: row.series,
    tags: row.tagText ? row.tagText.split(/\s+/).filter(Boolean) : [],
    excerpt: createExcerpt(row.bodyText, normalizedQuery),
    rank: Number(row.rank)
  }));
}

export function extractSearchText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`\n]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?]]/g, "$1")
    .replace(/[#>*_~`-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createExcerpt(text: string, query: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "";
  }

  const firstTerm = query.split(/\s+/)[0]?.toLowerCase();
  const matchIndex = firstTerm ? normalized.toLowerCase().indexOf(firstTerm) : -1;
  const start = Math.max(matchIndex - 80, 0);
  const excerpt = normalized.slice(start, start + 180);

  return `${start > 0 ? "... " : ""}${excerpt}${start + 180 < normalized.length ? " ..." : ""}`;
}
