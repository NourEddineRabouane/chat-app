import { api } from "@/lib/api/api";
import { User } from "./user.types";

export const getCurrentUser = async () => {
  try {
    const res = await api("/auth/me");
    console.log(res);
    const text = await res.text();

    return text ? (JSON.parse(text) as User) : {};
  } catch (err) {
    throw new Error(String(err));
  }
};
