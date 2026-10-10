"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type UIEvent,
} from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useStomp } from "@/providers/StompProvider";
import {
  Message,
  SendMessagePayload,
} from "@/features/messages/messages.types";
import {
  addMessageToCache,
  flattenMessages,
  useInfiniteMessages,
} from "@/features/messages/messages.queries";
import { useConversation } from "@/features/conversations/conversations.queries";
import ConversationHeader from "@/features/conversations/components/ConversationHeader";
import { User } from "@/features/user/user.types";
import { useTyping, useTypingIn } from "@/providers/TypingProvider";
import { TypingIndicator } from "@/features/user/components/TypingIndicator";

const LOAD_MORE_THRESHOLD_PX = 80;
const NEAR_BOTTOM_PX = 120;

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { data: session } = useSession();
  const { connected, subscribe, publish } = useStomp();
  const queryClient = useQueryClient();

  const {
    data: conversation,
    isPending: conversationPending,
    error: conversationError,
  } = useConversation(conversationId);

  const {
    data: messagePages,
    isPending: messagesPending,
    error: messagesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMessages(conversationId);

  // Oldest -> newest, de-duplicated
  const messages = useMemo(
    () =>
      flattenMessages(
        messagePages?.pages == undefined ? [] : messagePages.pages,
      ),
    [messagePages],
  );

  // ---- Scroll handling ------------------------------------------------------
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevFirstIdRef = useRef<string | null>(null);
  const prevLastIdRef = useRef<string | null>(null);
  const prevScrollHeightRef = useRef(0);
  const nearBottomRef = useRef(true); // is the reader at the bottom?
  const forceScrollRef = useRef(false); // set when I send a message
  const [hasNewBelow, setHasNewBelow] = useState(false);

  // Reset when switching conversations
  useLayoutEffect(() => {
    prevFirstIdRef.current = null;
    prevLastIdRef.current = null;
    prevScrollHeightRef.current = 0;
    nearBottomRef.current = true;
    forceScrollRef.current = false;
  }, [conversationId]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || messages.length === 0) return;

    const firstId = messages[0].messageId;
    const lastId = messages[messages.length - 1].messageId;

    if (prevLastIdRef.current === null) {
      // First render with data: jump to the bottom
      el.scrollTop = el.scrollHeight;
    } else if (lastId !== prevLastIdRef.current) {
      // New message at the bottom: follow it only if the reader is already
      // at the bottom (or just sent it). Otherwise leave their scroll alone.
      if (forceScrollRef.current || nearBottomRef.current) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
      forceScrollRef.current = false;
    } else if (firstId !== prevFirstIdRef.current) {
      // Older page prepended: keep the viewport where it was
      el.scrollTop += el.scrollHeight - prevScrollHeightRef.current;
    }

    prevFirstIdRef.current = firstId;
    prevLastIdRef.current = lastId;
    prevScrollHeightRef.current = el.scrollHeight;
  }, [messages]);

  const loadOlder = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
    setHasNewBelow(false);
  };

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    nearBottomRef.current = distanceFromBottom < NEAR_BOTTOM_PX;
    if (nearBottomRef.current) setHasNewBelow(false);
    if (el.scrollTop < LOAD_MORE_THRESHOLD_PX) loadOlder();
  };

  // If the loaded messages don't fill the container there is nothing to scroll,
  // so the scroll handler would never fire: keep fetching until it overflows.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollHeight <= el.clientHeight) loadOlder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, hasNextPage, isFetchingNextPage]);

  // ---- Real-time ------------------------------------------------------------
  const myId = session?.user?.id ? String(session.user.id) : "";

  useEffect(() => {
    if (!connected || !conversationId) return;
    const unsubscribe = subscribe(`/user/queue/messages`, (frame) => {
      const message: Message = JSON.parse(frame.body);
      if (Number(message.conversationId) === Number(conversationId)) {
        addMessageToCache(queryClient, conversationId, message);
        const isMine = String(message.senderId) === myId;
        if (!isMine && !nearBottomRef.current) setHasNewBelow(true);
      }
    });

    return () => unsubscribe?.();
  }, [connected, conversationId, subscribe, queryClient, myId]);

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !conversation || !session?.user?.id) return;

    const currentUserId = String(session.user.id);
    const firstUserId = String(conversation.firstUser.id);
    const secondUserId = String(conversation.secondUser.id);
    const receiverId = Number(
      currentUserId === firstUserId ? secondUserId : firstUserId,
    );

    const payload: SendMessagePayload = {
      conversationId: conversationId,
      senderId: Number(currentUserId),
      receiverId,
      content: content.trim(),
      createdAt: Date.now(),
    };

    publish("/app/chat.privateMessage", payload);
  };

  const user = session?.user as User | undefined;

  //  For typing indicator
  const { notifyTyping } = useTyping();
  const typingUserId = useTypingIn(conversationId);

  useEffect(() => {
    if (!typingUserId) return;
    const el = scrollRef.current;
    if (el && nearBottomRef.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [typingUserId]);

  if (conversationPending)
    return <div className="p-8 text-center text-gray-500">Loading chat...</div>;

  if (conversationError)
    return (
      <div className="p-8 text-center text-red-600">
        {conversationError.message}
      </div>
    );

  return (
    <>
      <div className="flex items-center border-b border-b-text-muted/40 bg-white p-4 shadow-sm">
        <ConversationHeader
          activeConversation={conversation}
          user={user ?? null}
        />
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 space-y-4 overflow-y-auto p-4"
      >
        {isFetchingNextPage && (
          <p className="text-center text-xs text-gray-400">
            Loading older messages...
          </p>
        )}
        {!hasNextPage && messages.length > 0 && (
          <p className="text-center text-xs text-gray-400">
            Beginning of the conversation
          </p>
        )}
        {messagesPending && (
          <p className="text-center text-sm text-gray-500">
            Loading messages...
          </p>
        )}
        {messagesError && (
          <p className="text-center text-sm text-red-600">
            {messagesError.message}
          </p>
        )}

        {messages.map((m, idx) => {
          const isMe = String(m.senderId) === String(session?.user?.id);
          return (
            <div
              key={m.messageId ?? `idx-${idx}`}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-text-muted/50 rounded-bl-none"
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}

        {typingUserId && (
          <div className="flex justify-end">
            <TypingIndicator />
          </div>
        )}
      </div>

      {/* Zero-height anchor so the button floats above the input without touching the layout */}
      <div className="relative h-0">
        {hasNewBelow && (
          <button
            type="button"
            onClick={scrollToBottom}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-md transition hover:bg-blue-700"
          >
            New messages ↓
          </button>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const input = form.elements.namedItem("content") as HTMLInputElement;
          handleSendMessage(input.value);
          input.value = "";
        }}
        className="flex gap-2 border-t border-t-text-muted/40 bg-white p-3"
      >
        <input
          onKeyDown={() =>
            notifyTyping(
              conversationId,
              conversation.firstUser.id === Number(myId)
                ? conversation.secondUser.id
                : conversation.firstUser.id,
            )
          }
          name="content"
          autoComplete="off"
          placeholder="Type your message..."
          className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-95"
        >
          Send
        </button>
      </form>
    </>
  );
}
