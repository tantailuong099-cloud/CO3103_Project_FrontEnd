"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/services/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post<{ access_token: string }>("/api/auth/login", {
        email,
        password,
      });

      console.log("✅ Login response:", res);

      if (res && res.access_token) {
        localStorage.setItem("token", res.access_token);
        router.push("/admin/dashboard");
      } else {
        throw new Error("Invalid response format: no token found");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1e1e1e] text-white px-4">
      <div className="w-full max-w-md bg-[#262626] rounded-2xl shadow-lg border border-[#303030] p-8">
        <div className="flex justify-center mb-8">
          <Image src="/icon/logo.png" alt="ARC Logo" width={160} height={50} />
        </div>

        {/* <h1 className="text-2xl font-semibold text-center mb-6">
          Welcome back Admin
        </h1> */}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] px-4 py-3 text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] px-4 py-3 text-white"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#fe8c31] hover:bg-[#ff9330] text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
