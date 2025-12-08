// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const PROTECTED_PATHS = ["/admin"];
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Cho phép truy cập các trang public của admin (Login/Register)
  if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // 2. Nếu không phải đường dẫn bắt đầu bằng /admin thì bỏ qua (matcher đã lo việc này nhưng check thêm cho chắc)
  if (!PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 3. Kiểm tra Token trong Cookie
  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 4. Gọi API Verify để xác thực token và lấy thông tin user
    const res = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${token}`,
      },
      // credentials: "include", // Dùng cái này nếu Backend check cookie của chính nó, nếu BE check header Cookie tự gửi thì có thể không cần.
    });

    // 5. Nếu Token không hợp lệ hoặc hết hạn
    if (!res.ok) {
      const loginUrl = new URL("/admin/login", req.url);
      const response = NextResponse.redirect(loginUrl);
      // Xóa cookie rác
      response.cookies.delete("access_token");
      return response;
    }

    // 6. CHECK ROLE ADMIN (Phần thêm mới)
    const userData = await res.json();

    // Giả sử API verify trả về object user có trường "role".
    // Kiểm tra xem role có phải là Admin không.
    if (userData.role !== "Admin") {
      // Nếu user đăng nhập rồi nhưng không phải Admin -> Đẩy về trang chủ (Client)
      const homeUrl = new URL("/", req.url);
      return NextResponse.redirect(homeUrl);
    }

    // 7. Hợp lệ -> Cho đi tiếp
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware verify error:", err);
    // Nếu lỗi mạng hoặc server die -> đẩy về login
    const loginUrl = new URL("/admin/login", req.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("access_token");
    return response;
  }
}

// Áp dụng cho toàn bộ folder /admin
export const config = {
  matcher: ["/admin/:path*"],
};
