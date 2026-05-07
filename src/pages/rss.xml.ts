import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response("RSS endpoint scaffold", {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" }
  });
};
