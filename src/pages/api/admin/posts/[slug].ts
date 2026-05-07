import type { APIRoute } from "astro";

export const PATCH: APIRoute = async ({ params, request }) => {
  return Response.json({
    ok: false,
    slug: params.slug,
    message: "Update post endpoint scaffold",
    method: request.method
  }, { status: 501 });
};

export const DELETE: APIRoute = async ({ params, request }) => {
  return Response.json({
    ok: false,
    slug: params.slug,
    message: "Delete post endpoint scaffold",
    method: request.method
  }, { status: 501 });
};
