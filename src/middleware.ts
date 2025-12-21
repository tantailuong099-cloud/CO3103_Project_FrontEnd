// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Các trang Admin Public (không cần login)
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/register"];
// Các trang User Public (không cần login - thêm vào nếu cần chặn người đã login vào lại trang login)
const PUBLIC_USER_PATHS = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bỏ qua các file tĩnh, hình ảnh, icon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("access_token")?.value;
  const isAdminPath = pathname.startsWith("/admin");

  // 1. TRƯỜNG HỢP KHÔNG CÓ TOKEN
  if (!token) {
    // Nếu vào trang admin (mà không phải trang login/reg) -> Đẩy về admin login
    if (isAdminPath && !PUBLIC_ADMIN_PATHS.includes(pathname)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    // Các trang user khác cho phép đi tiếp
    return NextResponse.next();
  }

  // 2. TRƯỜNG HỢP CÓ TOKEN -> XÁC THỰC VAI TRÒ
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${token}`,
      },
    });

    if (!res.ok) {
      // Token lỗi/hết hạn -> Xóa cookie và đẩy về trang login tương ứng
      const response = NextResponse.redirect(
        new URL(isAdminPath ? "/admin/login" : "/login", req.url)
      );
      response.cookies.delete("access_token");
      return response;
    }

    const userData = await res.json();
    const role = userData.role;

    // --- LOGIC PHÂN QUYỀN NGHIÊM NGẶT ---

    if (role === "Admin") {
      // ADMIN:
      // - Nếu đang ở trang không có /admin -> Bắt buộc đẩy vào /admin
      // - Nếu đang ở trang /admin/login hoặc /admin/register -> Đẩy vào /admin (Dashboard)
      if (!isAdminPath || PUBLIC_ADMIN_PATHS.includes(pathname)) {
        return NextResponse.redirect(new URL("/admin", req.url)); // Giả sử /admin là Dashboard
      }
    } else if (role === "User") {
      // USER:
      // - Nếu cố tình vào bất cứ trang nào có /admin -> Đẩy về trang chủ /
      // - Nếu đang ở trang /login hoặc /register -> Đẩy về trang chủ /
      if (isAdminPath || PUBLIC_USER_PATHS.includes(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Đúng vai trò đúng chỗ -> Cho đi tiếp
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware Error:", err);
    return NextResponse.next();
  }
}

// Matcher: Áp dụng cho toàn bộ ứng dụng để kiểm tra chéo các role
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
