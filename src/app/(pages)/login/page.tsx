"use client";

import { useState } from "react";
import { login } from "@/app/services/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/"); // redirect về trang chủ hoặc /cart
    } catch (err: any) {
      setError("Đăng nhập thất bại: " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded-lg w-80 space-y-3"
      >
        <h1 className="text-xl font-bold text-center">Đăng nhập</h1>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="border p-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
