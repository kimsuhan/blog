import type { MiddlewareHandler } from "astro";

// TODO: Protect /api/admin/* routes with Bearer Token auth.
export const onRequest: MiddlewareHandler = (_context, next) => next();
