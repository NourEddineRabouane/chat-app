import { memo } from "react";
import type { MessageGroupData } from "../messages.group";
import { Avatar } from "@/features/user/components/Avatar";
import { formatTime } from "@/lib/format";

type Props = {
  group: MessageGroupData;
  other: { id: number; username: string };
};

/**
 * A run of bubbles from one sender. Memoised: when a new message arrives only
 * the last group re-renders, not the whole thread.
 */
export const MessageGroup = memo(function MessageGroup({ group, other }: Props) {
  const { mine, messages, at } = group;

  return (
    <div className={`flex gap-3 ${mine ? "justify-end" : "justify-start"}`}>
      {!mine && <Avatar id={other.id} name={other.username} size="sm" className="mt-0.5" />}

      <div className={`flex min-w-0 max-w-[78%] flex-col gap-1.5 ${mine ? "items-end" : "items-start"}`}>
        {messages.map((m, i) => (
          <p
            key={m.messageId ?? i}
            className={`w-fit whitespace-pre-wrap break-words rounded-xl px-4 py-2.5 text-[14px] leading-snug ${
              mine
                ? "bg-bubble-out text-ink-600 shadow-bubble-out"
                : "bg-bubble-in text-bubble-in-text shadow-bubble-in"
            }`}
          >
            {m.content}
          </p>
        ))}
        <time
          suppressHydrationWarning
          dateTime={at}
          className="mt-0.5 text-[11px] text-ink-400"
        >
          {formatTime(at)}
        </time>
      </div>
    </div>
  );
});
