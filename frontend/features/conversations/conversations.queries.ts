import { useQuery } from "@tanstack/react-query";
import { Conversation } from "./conversations.types";
import { clientApi } from "@/lib/api/clientApi";

// Ids are Snowflakes (> 2^53): keep them as strings end to end. Number(id) would round them.
const isValidId = (id: string) => /^\d+$/.test(id);

export function useConversation(id: string) {
  return useQuery<Conversation, Error>({
    queryKey: ["conversation", id],
    queryFn: () => getConversation(id),
    enabled: isValidId(id),
    staleTime: 5 * 60_000, // metadata rarely changes
    gcTime: 30 * 60_000,
    retry: (failureCount, error) => {
      if (error.message.includes("not found")) return false; // don't retry 404s
      return failureCount < 2;
    },
  });
}

// Query Fns -------------------------------------

async function getConversation(id: string): Promise<Conversation> {
  const res = await clientApi(`/api/conversations/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Conversation not found");
    throw new Error(`Failed to load conversation (${res.status})`);
  }
  return res.json();
}
