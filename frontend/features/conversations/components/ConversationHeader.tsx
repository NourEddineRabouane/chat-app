"use client";

import Link from "next/link";
import { ArrowLeft, MoreHorizontal, Phone, Video } from "lucide-react";
import type { User } from "@/features/user/user.types";
import type { Conversation } from "../conversations.types";
import { Avatar } from "@/features/user/components/Avatar";
import { useFriendPresence } from "@/providers/PresenceProvider";

interface Props {
  activeConversation: Conversation;
  user: User | null;
}

// Call and menu actions are not wired to the backend yet
const ghostIcon =
  "grid size-9 place-items-center rounded-full text-ink-400 disabled:cursor-not-allowed";

export default function ConversationHeader({ activeConversation, user }: Props) {
  // The "other" person is whichever participant isn't the logged-in user.
  const other =
    String(activeConversation.firstUser.id) === String(user?.id)
      ? activeConversation.secondUser
      : activeConversation.firstUser;
  const status = useFriendPresence(other.id);

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-line bg-surface px-4 py-4 sm:px-6">
      {/* Phones only: the list and the chat are separate screens there */}
      <Link
        href="/chat"
        aria-label="Back to conversations"
        className="-ml-1 grid size-9 shrink-0 place-items-center rounded-full text-ink-600 active:bg-panel md:hidden"
      >
        <ArrowLeft className="size-5" strokeWidth={1.75} />
      </Link>

      <Avatar id={other.id} name={other.username} size="md" presence className="md:hidden" />

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-[15px] font-semibold text-ink-900">
          {other.username}
        </h2>
        <p
          className={`truncate text-[13px] ${
            status === "online" ? "text-mint-600" : "text-ink-400"
          }`}
        >
          {status === "online" ? "Online" : "Offline"}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button type="button" disabled title="Voice calls are coming soon" aria-label="Voice call (coming soon)" className={ghostIcon}>
          <Phone className="size-5" strokeWidth={1.75} />
        </button>
        <button type="button" disabled title="Video calls are coming soon" aria-label="Video call (coming soon)" className={ghostIcon}>
          <Video className="size-5" strokeWidth={1.75} />
        </button>
        <button type="button" disabled title="More options are coming soon" aria-label="More options (coming soon)" className={ghostIcon}>
          <MoreHorizontal className="size-5" strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}
