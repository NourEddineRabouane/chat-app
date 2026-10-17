"use client";

import Link from "next/link";
import { memo } from "react";
import { useParams } from "next/navigation";
import type { Conversation } from "../conversations.types";
import { Avatar } from "@/features/user/components/Avatar";
import { useTypingIn } from "@/providers/TypingProvider";
import { formatListStamp } from "@/lib/format";

type Props = {
  conversation: Conversation;
  currentUserId: number;
};

function pickOther(conversation: Conversation, currentUserId: number) {
  return conversation.firstUser.id === currentUserId
    ? conversation.secondUser
    : conversation.firstUser;
}

export const ConversationItem = memo(function ConversationItem({
  conversation,
  currentUserId,
}: Props) {
  const other = pickOther(conversation, currentUserId);
  const { conversationId } = useParams();
  const typingUserId = useTypingIn(conversation.id);

  const isActive = conversationId === conversation.id;

  return (
    <Link
      href={`/chat/${conversation.id}`}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3.5 px-5 py-4 transition-colors ${
        isActive ? "bg-mint-50" : "hover:bg-panel"
      }`}
    >
      <Avatar id={other.id} name={other.username} size="lg" presence />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-[15px] font-semibold text-ink-900">
            {other.username}
          </p>
          {/* Locale formatting can differ between server and browser */}
          <time
            suppressHydrationWarning
            dateTime={conversation.createdAt}
            className="shrink-0 text-xs text-ink-400"
          >
            {formatListStamp(conversation.createdAt)}
          </time>
        </div>
        {typingUserId ? (
          <p className="truncate text-[13px] font-semibold text-mint-600">
            is typing a message…
          </p>
        ) : (
          <p className="truncate text-[13px] text-ink-400">{other.email}</p>
        )}
      </div>
    </Link>
  );
});
