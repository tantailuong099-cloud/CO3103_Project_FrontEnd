// src/services/auth.ts
import { api } from "./api";

type LoginRes = { access_token: string };

export async function register(name: string, email: string, password: string) {
  // Gọi NestJS: POST /auth/register
  // Backend của bạn đang yêu cầu { name, email, password }
  return api.post("/api/auth/register", { name, email, password });
}

export async function login(email: string, password: string) {
  const data = await api.post<LoginRes>("/api/auth/login", { email, password });
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.access_token);
  }
  return data;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export function getToken() {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("token") ?? undefined;
}
