import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { User } from "@/features/user/user.types";
import { Conversation } from "../conversations.types";
// import ConnectionStatus from "./ConnectionStatus";

interface Props {
  activeConversation: Conversation;
  user: User | null;
}

const AVATAR_COLORS = [
  "bg-accent-teal",
  "bg-accent-orange",
  "bg-navy-900",
  "bg-blue-600",
];

export default function ConversationHeader({
  activeConversation,
  user,
}: Props) {
  // The "other" person is whichever participant isn't the logged-in user.
  const other =
    String(activeConversation.firstUser.id) === String(user?.id)
      ? activeConversation.secondUser
      : activeConversation.firstUser;

  const initial = (other.username || other.email || "?")[0].toUpperCase();
  const avatarColor = AVATAR_COLORS[Number(other.id) % AVATAR_COLORS.length];

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-b-text-muted/30 bg-surface/90 px-3 py backdrop-blur sm:px-5">
      {/* Back to the list: phones only (the list and chat are separate screens there) */}
      <Link
        href="/chat"
        aria-label="Back to conversations"
        className="-ml-1 grid size-10 shrink-0 place-items-center rounded-full text-navy-950 transition-colors active:bg-bubble-incoming md:hidden"
      >
        <ArrowLeft className="size-5" strokeWidth={1.75} />
      </Link>

      <div
        aria-hidden="true"
        className={`grid size-10 shrink-0 place-items-center rounded-full text-base font-medium text-white shadow-sm sm:size-11 ${avatarColor}`}
      >
        {initial}
      </div>

      {/* min-w-0 is what lets truncate work inside a flex row */}
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-medium text-navy-950">
          {other.username}
        </h2>
        <p className="truncate text-xs text-text-muted sm:text-sm">
          {other.email}
        </p>
      </div>

      {/* <ConnectionStatus /> */}
    </header>
  );
}
