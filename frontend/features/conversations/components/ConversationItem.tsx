"use client";

import Link from "next/link";
import type { Conversation } from "../conversations.types";
import { useParams } from "next/navigation";
import { StatusDot } from "@/features/user/components/StatusDot";
import { useTypingIn } from "@/providers/TypingProvider";
import { TypingIndicator } from "@/features/user/components/TypingIndicator";

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
  const typingUserId = useTypingIn(conversation.id);

  const isActive = conversationId === conversation.id;

  return (
    <Link
      href={`/chat/${conversation.id}`}
      className={`flex items-center gap-3 px-4 py-3 transition ${
        isActive ? "bg-blue-50 border-r-4 border-blue-600" : "hover:bg-gray-100"
      }`}
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
        {initial(other.username)}
        <StatusDot
          userId={other.id}
          size={12}
          className="absolute right-0 top-0 translate-x-1/3 translate-y-1/3 ring-2 ring-white"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm ${isActive ? "font-semibold text-blue-900" : "font-medium text-gray-900"}`}
        >
          {other.username}
        </p>
        <p className="truncate text-xs text-gray-500">{other.email}</p>
      </div>
      <div className="grid grid-rows-2 min-w-10 place-items-center">
        <time className="shrink-0 text-[10px] text-gray-400">
          {formatDate(conversation.createdAt)}
        </time>
        {typingUserId && <TypingIndicator short={true} />}
      </div>
    </Link>
  );
}
