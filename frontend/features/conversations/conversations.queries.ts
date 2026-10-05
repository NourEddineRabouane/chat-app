import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Conversation, createConversationPayload } from "./conversations.types";
import { clientApi } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";

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

export function useCreateConversation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      router.push(`/chat/${conversation.id}`);
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

async function createConversation(
  payload: createConversationPayload,
): Promise<Conversation> {
  const res = await clientApi("/api/conversations/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create conversation");

  return res.json();
}
