"use client";

import Link from "next/link";
import type { Conversation } from "../conversations.types";
import { useConversationStore } from "@/providers/ConversationStoreProvider";
import { useParams } from "next/navigation";

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
  const { conversationId } = useParams();

  const isActive = Number(conversationId) === conversation.id;

  return (
    <Link
      href={`/chat/${conversation.id}`}
      className={`flex items-center gap-3 px-4 py-3 transition ${
        isActive ? "bg-blue-50 border-r-4 border-blue-600" : "hover:bg-gray-100"
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
        {initial(other.username)}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm ${isActive ? "font-semibold text-blue-900" : "font-medium text-gray-900"}`}
        >
          {other.username}
        </p>
        <p className="truncate text-xs text-gray-500">{other.email}</p>
      </div>

      <time className="shrink-0 text-[10px] text-gray-400">
        {formatDate(conversation.createdAt)}
      </time>
    </Link>
  );
}
