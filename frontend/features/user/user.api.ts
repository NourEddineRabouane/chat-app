import { api } from "@/lib/api/api";
import { User } from "./user.types";

export const getCurrentUser = async (): Promise<User> => {
  try {
    const res = await api("/auth/me");

    const text: string = await res.text();

    if (!text) {
      throw new Error("Current user response is empty");
    }

    return JSON.parse(text) as User;
  } catch (err) {
    throw new Error(String(err));
  }
};
