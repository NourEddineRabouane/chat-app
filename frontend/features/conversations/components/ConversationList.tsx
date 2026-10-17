"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Conversation } from "../conversations.types";
import { ConversationItem } from "./ConversationItem";

type Props = {
  conversations: Conversation[];
  currentUserId: number;
};

export function ConversationList({ conversations, currentUserId }: Props) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => {
      const other =
        c.firstUser.id === currentUserId ? c.secondUser : c.firstUser;
      return other.username.toLowerCase().includes(q);
    });
  }, [conversations, currentUserId, query]);

  return (
    <>
      <div className="px-5 pb-3 pt-5">
        <label className="flex items-center gap-2.5 rounded-full bg-panel px-4 py-2.5 focus-within:ring-2 focus-within:ring-mint-500/40">
          <Search className="size-4.5 shrink-0 text-ink-400" strokeWidth={1.75} />
          <span className="sr-only">Search conversations</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            autoComplete="off"
            maxLength={50}
            className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
          />
        </label>
      </div>

      <div className="thin-scroll flex-1 overflow-y-auto pb-24">
        {conversations.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink-400">
            No conversations yet. Pick a friend to say hello.
          </p>
        ) : visible.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink-400">
            No one matches “{query.trim()}”.
          </p>
        ) : (
          <ul>
            {visible.map((c) => (
              <li key={c.id} className="border-b border-line last:border-b-0">
                <ConversationItem conversation={c} currentUserId={currentUserId} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
