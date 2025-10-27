// src/services/api.ts
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"; // your NestJS URL

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  path: string,
  method: HttpMethod = "GET",
  body?: any,
  token?: string
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    // If your backend uses cookie auth, also set:
    credentials: "include",
  });

  // Optional: throw for non-2xx to catch in UI
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(err || `HTTP ${res.status}`);
  }

  // Handle empty responses (204)
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, token?: string) => request<T>(path, "GET", undefined, token),
  post: <T>(path: string, body?: any, token?: string) => request<T>(path, "POST", body, token),
  put:  <T>(path: string, body?: any, token?: string) => request<T>(path, "PUT", body, token),
  patch:<T>(path: string, body?: any, token?: string) => request<T>(path, "PATCH", body, token),
  del:  <T>(path: string, token?: string) => request<T>(path, "DELETE", undefined, token),
};

// Small helper for client components
export function getToken() {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("token") ?? undefined;
}
