import { cookies } from "next/headers";
import { Conversation } from "./conversations.types";

const backendUrl = process.env.BACKEND_API_URL;

export const getConversations = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const res = await fetch(`${backendUrl}/api/conversations/me`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch conversations");

    const r = await res.json();

    return r;
  } catch (err) {
    throw new Error(String(err));
  }
};
