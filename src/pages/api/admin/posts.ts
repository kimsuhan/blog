import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  return Response.json({
    ok: false,
    message: "Create post endpoint scaffold",
    method: request.method
  }, { status: 501 });
};
