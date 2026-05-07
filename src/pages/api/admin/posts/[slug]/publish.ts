import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request }) => {
  return Response.json({
    ok: false,
    slug: params.slug,
    message: "Publish endpoint scaffold",
    method: request.method
  }, { status: 501 });
};
