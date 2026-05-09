import type { APIRoute } from "astro";
import { archivePost, updatePost } from "@/lib/post-store";

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
  try {
    if (!params.slug) {
      throw new Error("Post not found");
    }

    const post = await archivePost(params.slug);

    return Response.json({
      ok: true,
      post,
      physicalDelete: false
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to archive post";
    const status = message === "Post not found" ? 404 : 400;

    return Response.json({
      ok: false,
      error: message
    }, { status });
  }
};
