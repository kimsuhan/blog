import type { APIRoute } from "astro";
import { updatePost } from "@/lib/post-store";

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    if (!params.slug) {
      throw new Error("Post not found");
    }

    const body = await request.json();
    const post = await updatePost(params.slug, body);

    return Response.json({
      ok: true,
      post
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update post";
    const status = message === "Post not found" ? 404 : 400;

    return Response.json({
      ok: false,
      error: message
    }, { status });
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  return Response.json({
    ok: false,
    slug: params.slug,
    message: "Delete post endpoint scaffold",
    method: request.method
  }, { status: 501 });
};
