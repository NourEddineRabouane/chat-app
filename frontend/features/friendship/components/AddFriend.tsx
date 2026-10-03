"use client";

import { Check, Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { useDebouncedValue } from "./useDebounedValue";
import {
  MIN_SEARCH_LENGTH,
  useSearchUsers,
  useSendFriendRequest,
} from "../friendship.queries";
import type { FriendshipStatus } from "../friendship.types";
import {
  ActionError,
  Card,
  ghostButton,
  primaryButton,
  StateMessage,
  UserRow,
} from "./Shared";

export default function AddFriend() {
  const [input, setInput] = useState("");
  // userId -> what happened when we sent (PENDING = "Sent", ACCEPTED = they had already asked us)
  const [sent, setSent] = useState<Record<number, FriendshipStatus>>({});

  const term = useDebouncedValue(input, 300).trim();
  const { data: results = [], isFetching, error } = useSearchUsers(term);
  const send = useSendFriendRequest();

  const ready = term.length >= MIN_SEARCH_LENGTH;

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search people by username</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search by username..."
          autoComplete="off"
          className="w-full rounded-full border border-text-muted/40 bg-surface py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/30"
        />
      </label>

      <div className="mt-4">
        {!ready ? (
          <StateMessage>
            Type at least {MIN_SEARCH_LENGTH} characters to find people.
          </StateMessage>
        ) : error ? (
          <StateMessage tone="error">{error.message}</StateMessage>
        ) : results.length === 0 ? (
          <StateMessage>
            {isFetching ? "Searching..." : "No users found."}
          </StateMessage>
        ) : (
          <Card>
            {results.map((user) => {
              const status = sent[user.id];
              const sending = send.isPending && send.variables === user.id;

              return (
                <li key={user.id}>
                  <UserRow user={user}>
                    {status ? (
                      <span className={`${ghostButton} pointer-events-none`}>
                        <Check className="size-3.5" />
                        {status === "ACCEPTED" ? "Friends" : "Sent"}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className={primaryButton}
                        disabled={sending}
                        onClick={() =>
                          send.mutate(user.id, {
                            onSuccess: (request) =>
                              setSent((prev) => ({
                                ...prev,
                                [user.id]: request.status,
                              })),
                          })
                        }
                      >
                        <UserPlus className="size-3.5" />
                        {sending ? "Sending..." : "Add"}
                      </button>
                    )}
                  </UserRow>
                </li>
              );
            })}
          </Card>
        )}
        <ActionError error={send.error} />
      </div>
    </div>
  );
}
