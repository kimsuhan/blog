import type { APIRoute } from "astro";
import { listPublishedPosts } from "@/lib/post-store";
import { absoluteUrl, defaultDescription, escapeXml, siteName } from "@/lib/seo";

export const GET: APIRoute = async () => {
  const posts = await listPublishedPosts();
  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/posts/${post.metadata.slug}`);

      return `<item>
  <title>${escapeXml(post.metadata.title)}</title>
  <link>${escapeXml(url)}</link>
  <guid>${escapeXml(url)}</guid>
  <description>${escapeXml(post.metadata.description)}</description>
  <pubDate>${new Date(post.metadata.date).toUTCString()}</pubDate>
</item>`;
    })
    .join("\n");
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(siteName)}</title>
  <link>${escapeXml(absoluteUrl("/"))}</link>
  <description>${escapeXml(defaultDescription)}</description>
  ${items}
</channel>
</rss>`;

  return new Response(rss, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" }
  });
};
