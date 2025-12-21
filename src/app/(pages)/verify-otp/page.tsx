"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp } from "@/app/services/auth";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Thiếu thông tin email. Vui lòng quay lại.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await verifyOtp(email, otp);
      router.push("/reset-password");
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
          Xác thực OTP
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Mã xác thực đã được gửi đến:{" "}
          <span className="text-white">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="w-full rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] px-4 py-3 text-white text-center text-2xl tracking-[10px] outline-none focus:border-[#fe8c31]"
              placeholder="000000"
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#fe8c31] hover:bg-[#ff9330] text-white py-3 rounded-lg font-semibold transition-all"
          >
            {loading ? "Đang xác thực..." : "Xác thực mã"}
          </button>
        </form>
      </div>
    </main>
  );
}
