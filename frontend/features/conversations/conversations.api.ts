import { api } from "@/lib/api/api";

export const getConversations = async () => {
  try {
    const res = await api("/api/conversations/me");

    if (!res.ok) throw new Error("Failed to fetch conversations");

    const text = await res.text();

    return text ? JSON.parse(text) : [];
  } catch (err) {
    throw new Error(String(err));
  }
};
