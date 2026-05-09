import type { APIRoute } from "astro";
import { absoluteUrl } from "@/lib/seo";

export const GET: APIRoute = async () => {
  return new Response(`User-agent: *
Allow: /
Sitemap: ${absoluteUrl("/sitemap.xml")}
`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
