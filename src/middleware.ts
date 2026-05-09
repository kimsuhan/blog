import type { MiddlewareHandler } from "astro";
import { authErrorResponse, verifyAdminRequest } from "@/lib/auth";

export const onRequest: MiddlewareHandler = (context, next) => {
  if (!context.url.pathname.startsWith("/api/admin/")) {
    return next();
  }

  const auth = verifyAdminRequest(context.request);

  if (!auth.ok) {
    return authErrorResponse(auth);
  }

  return next();
};
