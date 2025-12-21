import { api } from "./api";

export type User = {
  userId: string;
  email: string;
};

export async function register(data: {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}): Promise<void> {
  await api.post("/api/auth/register", data, { Credential: "include" });
}

export async function login(email: string, password: string): Promise<void> {
  await api.post(
    "/api/auth/login",
    { email, password },
    { Credential: "include" }
  );
}

export async function logout(): Promise<void> {
  await api.post("/api/auth/logout", null, {
    Credential: "include",
  });
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>("/api/auth/profile", {
    Credential: "include",
  });

  return res;
}

export const forgotPassword = async (email: string) => {
  const res = await fetch(
    `http://localhost:4000/api/auth/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Không thể gửi OTP");
  }
  return res.json();
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await fetch(
    `http://localhost:4000/api/auth/verify-otp`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      credentials: "include",
    }
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Mã OTP không chính xác");
  }
  return res.json(); // NestJS sẽ set cookie access_token tại đây
};

export const resetPassword = async (password: string) => {
  const res = await fetch(
    `http://localhost:4000/api/auth/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include",
    }
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Không thể đổi mật khẩu");
  }
  return res.json();
};
