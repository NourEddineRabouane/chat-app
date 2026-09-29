import { cookies } from "next/headers";
import { User } from "./user.types";

const backendUrl = process.env.BACKEND_API_URL;

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const res = await fetch(`${backendUrl}/auth/me`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });
    const user: User = await res.json();

    return user;
  } catch (err) {
    throw new Error(String(err));
  }
};
