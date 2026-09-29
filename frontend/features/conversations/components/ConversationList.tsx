import Link from "next/link";
import type { Conversation } from "../conversations.types";
import { ConversationItem } from "./ConversationItem";

type Props = {
  conversations: Conversation[];
  currentUserId: number;
};

export function ConversationList({ conversations, currentUserId }: Props) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
        No conversations yet.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 rounded-lg border bg-white">
      {conversations.map((c) => (
        <li key={c.id}>
          <ConversationItem conversation={c} currentUserId={currentUserId} />
        </li>
      ))}
    </ul>
  );
}
