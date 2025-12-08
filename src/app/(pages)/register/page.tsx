"use client";

import Image from "next/image";
import { useState } from "react";
import { register, login } from "@/app/services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // ✅ NEW
  const [address, setAddress] = useState("");         // ✅ NEW
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    if (!name.trim()) return setErr("Vui lòng nhập tên.");
    if (!email.trim()) return setErr("Vui lòng nhập email.");
    if (!phoneNumber.trim()) return setErr("Vui lòng nhập số điện thoại.");
    if (!address.trim()) return setErr("Vui lòng nhập địa chỉ.");
    if (password.length < 6) return setErr("Mật khẩu tối thiểu 6 ký tự.");
    if (password !== confirm) return setErr("Xác nhận mật khẩu không khớp.");

    try {
      setLoading(true);

      // ✅ Đăng ký (đúng theo CreateUserDto)
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
      });

      // ✅ Login để backend set COOKIE
      await login(email.trim(), password);

      // ✅ Sau khi có cookie → vào trang chủ
      router.push("/");
    } catch (e: any) {
      const msg =
        typeof e?.message === "string" ? e.message : "Đăng ký thất bại.";
      setErr(msg);
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
          Tạo tài khoản
        </h1>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* ✅ NAME */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              className="w-full rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] px-4 py-3 text-white outline-none focus:border-[#fe8c31]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* ✅ EMAIL */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] px-4 py-3 text-white outline-none focus:border-[#fe8c31]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* ✅ PHONE NUMBER */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              placeholder="0912345678"
              className="w-full rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] px-4 py-3 text-white outline-none focus:border-[#fe8c31]"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* ✅ ADDRESS */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Địa chỉ
            </label>
            <input
              type="text"
              placeholder="123 ABC Street, Quận 1, TP.HCM"
              className="w-full rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] px-4 py-3 text-white outline-none focus:border-[#fe8c31]"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* ✅ PASSWORD */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] px-4 py-3 text-white outline-none focus:border-[#fe8c31]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* ✅ CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] px-4 py-3 text-white outline-none focus:border-[#fe8c31]"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {err && (
            <p className="text-red-400 text-sm text-center">{err}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#fe8c31] hover:bg-[#ff9330] text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-[#fe8c31] hover:underline font-medium"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
}
