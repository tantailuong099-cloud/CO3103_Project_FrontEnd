"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { login } from "@/app/services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Nếu đã đăng nhập rồi mà vào /login -> tự chuyển sang /cart
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("access_token");
    if (token) {
      router.replace("/cart");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      // ✅ Login xong chuyển sang cart + reload app để Navbar nhận token
      window.location.href = "/";
    } catch (err: any) {
      console.error("❌ Login error:", err);
      const msg =
        typeof err?.message === "string"
          ? err.message
          : "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1e1e1e] text-white px-4">
      <div className="w-full max-w-md bg-[#262626] rounded-2xl shadow-lg border border-[#303030] p-8">
        <div className="flex justify-center mb-8">
          <Image src="/icon/logo.png" alt="Logo" width={160} height={50} />
        </div>

        <h1 className="text-2xl font-semibold text-center mb-6">
          Đăng nhập
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] px-4 py-3 text-white outline-none focus:border-[#fe8c31]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] px-4 py-3 text-white outline-none focus:border-[#fe8c31]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#fe8c31] hover:bg-[#ff9330] text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-[#fe8c31] hover:underline font-medium"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </main>
  );
}
