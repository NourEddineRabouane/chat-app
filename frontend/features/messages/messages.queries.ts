import {
  type InfiniteData,
  type QueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Message, MessagePages } from "./messages.types";
import { clientApi } from "@/lib/api/clientApi";

const isValidId = (id: string) => /^\d+$/.test(id);

export const messagesKey = (conversationId: string): ["messages", string] => [
  "messages",
  conversationId,
];

export function useInfiniteMessages(conversationId: string, size = 20) {
  return useInfiniteQuery<
    MessagePages, // TQueryFnData
    Error, // TError
    { pages: MessagePages[]; pageParams: number[] },
    ["messages", string], // TQueryKey
    number // TPageParam
  >({
    queryKey: messagesKey(conversationId),
    queryFn: ({ pageParam }) => getMessages(conversationId, pageParam, size),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
    enabled: isValidId(conversationId),
    staleTime: Infinity, // WebSocket is the source of freshness
    gcTime: 5 * 60_000,
  });
}

/**
 * Pages come from the API newest-first (page 1 = latest messages).
 * The UI wants oldest -> newest, so walk pages and items backwards.
 * De-dupes by messageId: new messages shift the offsets, so a later page
 * can contain a message that is already in an earlier one.
 */
export function flattenMessages(pages: MessagePages[] | undefined): Message[] {
  if (!pages) return [];
  const seen = new Set<number>();
  const out: Message[] = [];
  for (let i = pages.length - 1; i >= 0; i--) {
    const items = pages[i].data ?? [];
    for (let j = items.length - 1; j >= 0; j--) {
      const m = items[j];
      // Only de-dupe when there is an id to compare
      if (m.messageId != null) {
        if (seen.has(m.messageId)) continue;
        seen.add(m.messageId);
      }
      out.push(m);
    }
  }
  return out;
}

/** Push a new (incoming or optimistic) message into page 1 of the cache. */
export function addMessageToCache(
  queryClient: QueryClient,
  conversationId: string,
  message: Message,
) {
  queryClient.setQueryData<InfiniteData<MessagePages, number>>(
    messagesKey(conversationId),
    (old) => {
      if (!old || old.pages.length === 0) return old;
      if (
        message.messageId != null &&
        old.pages.some((p) =>
          p.data.some((m) => m.messageId === message.messageId),
        )
      ) {
        return old;
      }
      const [first, ...rest] = old.pages;
      return {
        ...old,
        pages: [
          {
            ...first,
            data: [message, ...first.data],
            totalItems: first.totalItems + 1,
          },
          ...rest,
        ],
      };
    },
  );
}

// Query Fns
async function getMessages(
  conversationId: string,
  page: number,
  size = 20,
): Promise<MessagePages> {
  console.log(conversationId, page, size);
  const res = await clientApi(
    `/api/conversations/${conversationId}/messages?page=${page}&size=${size}`,
  );
  if (!res.ok) throw new Error(`Failed to fetch messages (${res.status})`);
  return res.json();
}
