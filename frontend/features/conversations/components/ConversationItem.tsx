"use client";

import Link from "next/link";
import type { Conversation } from "../conversations.types";
import { useConversationStore } from "@/providers/ConversationStoreProvider";

type Props = {
  conversation: Conversation;
  currentUserId: number;
};

function pickOther(conversation: Conversation, currentUserId: number) {
  return conversation.firstUser.id === currentUserId
    ? conversation.secondUser
    : conversation.firstUser;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function initial(username: string) {
  return username.charAt(0).toUpperCase();
}

export function ConversationItem({ conversation, currentUserId }: Props) {
  const other = pickOther(conversation, currentUserId);
  const { setSelectedConversation } = useConversationStore((state) => state);

  return (
    <Link
      href={`/chat/${conversation.id}`}
      className="flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50"
      onClick={() => {
        setSelectedConversation(conversation);
      }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
        {initial(other.username)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900">{other.username}</p>
        <p className="truncate text-sm text-gray-500">{other.email}</p>
      </div>

      <time className="shrink-0 text-xs text-gray-400">
        {formatDate(conversation.createdAt)}
      </time>
    </Link>
  );
}
