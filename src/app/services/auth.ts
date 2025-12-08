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
  await api.post(
    "/api/auth/register",
    data,
    { withCredentials: true }
  );
}

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

export async function logout(): Promise<void> {
  await api.post("/api/auth/logout", null, {
    withCredentials: true,
  });
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>("/api/auth/profile", {
    withCredentials: true,
  });

  return res;
}
