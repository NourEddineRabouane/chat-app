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
import { buildThread } from "@/features/messages/messages.group";
import { MessageGroup } from "@/features/messages/components/MessageGroup";
import MessageComposer from "@/features/messages/components/MessageComposer";

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

  // Day dividers + runs of messages from the same sender
  const thread = useMemo(() => buildThread(messages, myId), [messages, myId]);

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
    return <div className="p-8 text-center text-ink-400">Loading chat…</div>;

  if (conversationError)
    return (
      <div role="alert" className="p-8 text-center text-danger">
        {conversationError.message}
      </div>
    );

  const other =
    conversation.firstUser.id === Number(myId)
      ? conversation.secondUser
      : conversation.firstUser;

  return (
    <>
      <ConversationHeader
        activeConversation={conversation}
        user={user ?? null}
      />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="thin-scroll flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6"
      >
        {isFetchingNextPage && (
          <p className="text-center text-xs text-ink-400">
            Loading older messages…
          </p>
        )}
        {!hasNextPage && messages.length > 0 && (
          <p className="text-center text-xs text-ink-400">
            Beginning of the conversation
          </p>
        )}
        {messagesPending && (
          <p className="text-center text-sm text-ink-400">Loading messages…</p>
        )}
        {messagesError && (
          <p role="alert" className="text-center text-sm text-danger">
            {messagesError.message}
          </p>
        )}

        {thread.map((item) =>
          item.type === "day" ? (
            <div key={item.key} className="flex justify-center">
              <span className="rounded-full bg-line px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                {item.label}
              </span>
            </div>
          ) : (
            <MessageGroup key={item.key} group={item} other={other} />
          ),
        )}

        {typingUserId && (
          <div className="flex pl-11">
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
            className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-mint-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-mint-700"
          >
            New messages ↓
          </button>
        )}
      </div>

      <MessageComposer
        onSend={handleSendMessage}
        onTyping={() => notifyTyping(conversationId, other.id)}
      />
    </>
  );
}
