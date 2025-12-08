import { api } from "./api";

// ✅ Kiểu user đúng theo backend của bạn (/auth/profile)
export type User = {
  userId: string;
  email: string;
};

// ✅ Register
export async function register(
  name: string,
  email: string,
  password: string
): Promise<void> {
  await api.post("/api/auth/register", { name, email, password }, {
    withCredentials: true,
  });
}

// ✅ Login (cookie httpOnly)
export async function login(
  email: string,
  password: string
): Promise<void> {
  await api.post(
    "/api/auth/login",
    { email, password },
    { withCredentials: true }
  );
}

// ✅ Logout (backend clear cookie)
export async function logout(): Promise<void> {
  await api.post("/api/auth/logout", null, {
    withCredentials: true,
  });
}

// ✅ Get current user từ cookie
export async function getMe(): Promise<User> {
  const res = await api.get<User>("/api/auth/profile", {
    withCredentials: true,
  });

  // ✅ Trả về đúng kiểu User (không phải unknown)
  return res;
}
