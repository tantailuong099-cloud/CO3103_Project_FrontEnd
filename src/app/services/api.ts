const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  path: string,
  method: HttpMethod = "GET",
  body?: any
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(err || `HTTP ${res.status}`);
  }

  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export const api = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body?: any) => request<T>(path, "POST", body),
  patch: <T>(path: string, body?: any) => request<T>(path, "PATCH", body),
  del: <T>(path: string) => request<T>(path, "DELETE"),
};
