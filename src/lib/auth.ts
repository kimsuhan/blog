export interface AuthResult {
  ok: boolean;
  status: number;
  error?: string;
}

export function verifyAdminRequest(request: Request): AuthResult {
  const configuredToken = import.meta.env.ADMIN_API_TOKEN;

  if (!configuredToken) {
    return {
      ok: false,
      status: 500,
      error: "Admin API token is not configured"
    };
  }

  const authorization = request.headers.get("authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token || token !== configuredToken) {
    return {
      ok: false,
      status: 401,
      error: "Unauthorized"
    };
  }

  return {
    ok: true,
    status: 200
  };
}

export function authErrorResponse(result: AuthResult): Response {
  return Response.json(
    {
      ok: false,
      error: result.error ?? "Unauthorized"
    },
    { status: result.status }
  );
}
