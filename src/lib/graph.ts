import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { and, eq, inArray } from "drizzle-orm";
import { postLinks, posts } from "../../drizzle/schema";
import { db } from "./db";

export interface Wikilink {
  rawText: string;
  targetSlug: string;
  displayText: string;
}

export interface GraphNode {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  series: string | null;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: "wikilink";
  rawText: string;
  displayText: string | null;
  resolved: boolean;
}

export interface GraphIndex {
  generatedAt: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const wikilinkPattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
const graphIndexPath = path.join(process.cwd(), "data", "graph-index.json");

export function parseWikilinks(markdown: string): Wikilink[] {
  return Array.from(markdown.matchAll(wikilinkPattern)).map((match) => {
    const targetSlug = normalizeTargetSlug(match[1]);
    const displayText = (match[2] ?? targetSlug).trim();

    return {
      rawText: match[0],
      targetSlug,
      displayText
    };
  });
}

export function replaceWikilinks(markdown: string): string {
  return markdown
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((segment) => {
      if (segment.startsWith("`")) {
        return segment;
      }

      return replaceWikilinksInText(segment);
    })
    .join("");
}

export async function buildGraphIndex(): Promise<GraphIndex> {
  const publishedPosts = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      description: posts.description,
      series: posts.series
    })
    .from(posts)
    .where(eq(posts.status, "published"));
  const postIds = publishedPosts.map((post) => post.id);

  if (postIds.length === 0) {
    return {
      generatedAt: new Date().toISOString(),
      nodes: [],
      edges: []
    };
  }

  const links = await db
    .select({
      sourceSlug: posts.slug,
      targetSlug: postLinks.targetSlug,
      targetPostId: postLinks.targetPostId,
      rawText: postLinks.rawText,
      displayText: postLinks.displayText
    })
    .from(postLinks)
    .innerJoin(posts, eq(postLinks.sourcePostId, posts.id))
    .where(and(eq(postLinks.linkType, "wikilink"), inArray(postLinks.sourcePostId, postIds)));
  const publishedPostIds = new Set(postIds);

  return {
    generatedAt: new Date().toISOString(),
    nodes: publishedPosts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.description,
      series: post.series
    })),
    edges: links.map((link) => ({
      source: link.sourceSlug,
      target: link.targetSlug,
      type: "wikilink",
      rawText: link.rawText,
      displayText: link.displayText,
      resolved: Boolean(link.targetPostId && publishedPostIds.has(link.targetPostId))
    }))
  };
}

export async function writeGraphIndexFile(filePath = graphIndexPath): Promise<GraphIndex> {
  const index = await buildGraphIndex();

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(index, null, 2)}\n`, "utf8");

  return index;
}

function replaceWikilinksInText(markdown: string): string {
  return markdown.replace(wikilinkPattern, (_raw, target: string, display?: string) => {
    const targetSlug = normalizeTargetSlug(target);
    const label = escapeMarkdownLinkLabel((display ?? targetSlug).trim());

    return `[${label}](/posts/${encodeURIComponent(targetSlug)})`;
  });
}

function normalizeTargetSlug(value: string): string {
  return value.trim();
}

function escapeMarkdownLinkLabel(value: string): string {
  return value.replaceAll("[", "\\[").replaceAll("]", "\\]");
}
