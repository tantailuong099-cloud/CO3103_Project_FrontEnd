const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"; // NestJS backend URL

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  body?: any;
  headers?: Record<string, string>;
}

async function request<T>(
  path: string,
  method: HttpMethod = "GET",
  { body, headers }: RequestOptions = {}
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  // ✅ Nếu là FormData → KHÔNG set Content-Type (fetch sẽ tự thêm boundary)
  // ✅ Nếu là JSON → tự set Content-Type: application/json
  const finalHeaders: Record<string, string> = isFormData
    ? { ...(headers ?? {}) }
    : { "Content-Type": "application/json", ...(headers ?? {}) };

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    credentials: "include", // cho phép gửi cookie/session nếu có
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(errText || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>(path, "GET", { headers }),

  post: <T>(path: string, body?: any, headers?: Record<string, string>) =>
    request<T>(path, "POST", { body, headers }),

  put: <T>(path: string, body?: any, headers?: Record<string, string>) =>
    request<T>(path, "PUT", { body, headers }),

  patch: <T>(path: string, body?: any, headers?: Record<string, string>) =>
    request<T>(path, "PATCH", { body, headers }),

  del: <T>(path: string, headers?: Record<string, string>) =>
    request<T>(path, "DELETE", { headers }),
};
