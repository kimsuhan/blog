import type { APIRoute } from "astro";
import { publishPost } from "@/lib/post-store";

export const POST: APIRoute = async ({ params }) => {
  try {
    if (!params.slug) {
      throw new Error("Post not found");
    }

    const post = await publishPost(params.slug);

    return Response.json({
      ok: true,
      post
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to publish post";
    const status = message === "Post not found" ? 404 : message === "Post is already published" ? 409 : 400;

    return Response.json({
      ok: false,
      error: message
    }, { status });
  }
};
