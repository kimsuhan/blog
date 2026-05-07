import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request }) => {
  return Response.json({
    ok: false,
    slug: params.slug,
    message: "AI draft endpoint scaffold. This is outside MVP.",
    method: request.method
  }, { status: 501 });
};
