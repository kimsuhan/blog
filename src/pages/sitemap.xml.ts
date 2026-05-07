import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response("Sitemap endpoint scaffold", {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
};
