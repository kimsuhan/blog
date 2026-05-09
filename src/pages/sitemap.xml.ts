import type { APIRoute } from "astro";
import { listPublishedPosts } from "@/lib/post-store";
import { absoluteUrl, escapeXml } from "@/lib/seo";

export const GET: APIRoute = async () => {
  const posts = await listPublishedPosts();
  const staticPaths = ["/", "/search"];
  const tagPaths = Array.from(new Set(posts.flatMap((post) => post.metadata.tags))).map(
    (tag) => `/tags/${encodeURIComponent(tag)}`
  );
  const seriesPaths = Array.from(
    new Set(posts.flatMap((post) => (post.metadata.series ? [post.metadata.series] : [])))
  ).map((series) => `/series/${encodeURIComponent(series)}`);
  const postPaths = posts.map((post) => `/posts/${post.metadata.slug}`);
  const urls = [...staticPaths, ...postPaths, ...tagPaths, ...seriesPaths];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url><loc>${escapeXml(absoluteUrl(url))}</loc></url>`)
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
};
