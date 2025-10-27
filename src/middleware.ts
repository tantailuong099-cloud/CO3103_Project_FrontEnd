// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const PROTECTED_PATHS = ["/admin"];
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (!PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      const loginUrl = new URL("/admin/login", req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("access_token");
      return response;
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware verify error:", err);
    const loginUrl = new URL("/login", req.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("access_token");
    return response;
  }
}

// Áp dụng cho các đường dẫn nhất định
export const config = {
  matcher: ["/admin/:path*"],
};
