export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message);
  }
}

const DEFAULT_API_BASE_URL = "http://localhost:3000";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

async function requestJson<TResponse>(
  method: "POST" | "PUT",
  path: string,
  body: unknown,
  token?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: JSON.stringify(body)
  });

  const payload = await response.json().catch(() => undefined);

  if (!response.ok) {
    const code = payload?.error?.code ?? "request_failed";
    const message = payload?.error?.message ?? "Request failed";
    throw new ApiError(code, message, response.status);
  }

  return payload as TResponse;
}

export function postJson<TResponse>(path: string, body: unknown, token?: string) {
  return requestJson<TResponse>("POST", path, body, token);
}

export function putJson<TResponse>(path: string, body: unknown, token?: string) {
  return requestJson<TResponse>("PUT", path, body, token);
}
