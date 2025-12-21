"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { forgotPassword } from "@/app/services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await forgotPassword(email.trim());
      // Chuyển sang trang nhập OTP và truyền email qua query string
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message);
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
        <h1 className="text-2xl font-semibold text-center mb-2">
          Quên mật khẩu
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Nhập email để nhận mã xác thực OTP
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] px-4 py-3 text-white outline-none focus:border-[#fe8c31]"
              placeholder="you@example.com"
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#fe8c31] hover:bg-[#ff9330] text-white py-3 rounded-lg font-semibold transition-all"
          >
            {loading ? "Đang gửi mã..." : "Gửi mã xác thực"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Quay lại{" "}
          <Link href="/login" className="text-[#fe8c31] hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
}
