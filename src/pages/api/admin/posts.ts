import type { APIRoute } from "astro";
import { createDraftPost } from "@/lib/post-store";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const post = await createDraftPost(body);

    return Response.json({
      ok: true,
      post
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create post";
    const status = message.includes("already exists") ? 409 : 400;

    return Response.json({
      ok: false,
      error: message
    }, { status });
  }
};
