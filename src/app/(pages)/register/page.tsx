"use client";

import { useState, useEffect } from "react";
import { register, login, getToken} from "@/app/services/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // Nếu đã đăng nhập rồi, tự chuyển về trang chủ
  useEffect(() => {
    if (getToken()) router.replace("/");
  }, [router]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    if (!name.trim()) return setErr("Vui lòng nhập tên.");
    if (!email.trim()) return setErr("Vui lòng nhập email.");
    if (password.length < 6) return setErr("Mật khẩu tối thiểu 6 ký tự.");
    if (password !== confirm) return setErr("Xác nhận mật khẩu không khớp.");

    try {
      setLoading(true);
      // 1) gọi register
      await register(name.trim(), email.trim(), password);

      // 2) đăng nhập luôn để có token (UX tốt hơn)
      await login(email.trim(), password);

      // 3) điều hướng
      router.push("/"); // hoặc /cart
    } catch (e: any) {
      // NestJS có thể trả lỗi "Email already exists"
      const msg = typeof e?.message === "string" ? e.message : "Đăng ký thất bại.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="bg-white shadow p-6 rounded-lg w-[360px] space-y-3">
        <h1 className="text-2xl font-bold text-center">Tạo tài khoản</h1>

        <input
          type="text"
          placeholder="Họ và tên"
          className="border p-2 w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu (≥ 6 ký tự)"
          className="border p-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          className="border p-2 w-full rounded"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {err && <p className="text-red-500 text-sm">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-60"
        >
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Đã có tài khoản? <a href="/login" className="text-blue-600 hover:underline">Đăng nhập</a>
        </p>
      </form>
    </main>
  );
}
