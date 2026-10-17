import type { Message } from "./messages.types";
import { dayKey, formatDayLabel } from "@/lib/format";

export type MessageGroupData = {
  type: "group";
  key: string;
  mine: boolean;
  messages: Message[];
  /** Timestamp of the last message in the group */
  at: string;
};
export type DayDivider = { type: "day"; key: string; label: string };
export type ThreadItem = MessageGroupData | DayDivider;

const GROUP_GAP_MS = 5 * 60_000;

/**
 * Turns a flat, oldest->newest list into day dividers + runs of consecutive
 * messages from the same sender (a new run starts after a 5 minute pause).
 */
export function buildThread(messages: Message[], myId: string): ThreadItem[] {
  const items: ThreadItem[] = [];
  let lastDay = "";
  let current: MessageGroupData | null = null;
  let lastTime = 0;

  messages.forEach((m, i) => {
    const day = dayKey(m.createdAt);
    const time = new Date(m.createdAt).getTime();
    const mine = String(m.senderId) === myId;

    if (day !== lastDay) {
      items.push({ type: "day", key: `day-${day}`, label: formatDayLabel(m.createdAt) });
      lastDay = day;
      current = null;
    }

    if (!current || current.mine !== mine || time - lastTime > GROUP_GAP_MS) {
      current = {
        type: "group",
        key: `g-${m.messageId ?? i}`,
        mine,
        messages: [],
        at: m.createdAt,
      };
      items.push(current);
    }
    current.messages.push(m);
    current.at = m.createdAt;
    lastTime = time;
  });

  return items;
}
