import { api } from "./api";

export type User = {
  userId: string;
  email: string;
  avatar?: string;
  name: string;
};

export async function register(data: {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}): Promise<void> {
  await api.post<void>("/api/auth/register", data);
}

export async function login(email: string, password: string): Promise<void> {
  await api.post<void>("/api/auth/login", { email, password });
}

export async function logout(): Promise<void> {
  await api.post<void>("/api/auth/logout");
}

export async function getMe(): Promise<User> {
  return await api.get<User>("/api/auth/profile");
}

export const forgotPassword = async (email: string) => {
  return await api.post("/api/auth/forgot-password", { email });
};

export const verifyOtp = async (email: string, otp: string) => {
  return await api.post("/api/auth/verify-otp", { email, otp });
};

export const resetPassword = async (password: string) => {
  return await api.post("/api/auth/reset-password", { password });
};
