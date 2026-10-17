/** Small date helpers shared by the chat UI. All take an ISO string or epoch ms. */

const timeFmt = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});
const dayFmt = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "short",
  day: "numeric",
});
const shortFmt = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

const toDate = (v: string | number) => new Date(v);
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export const formatTime = (v: string | number) => timeFmt.format(toDate(v));

export function dayKey(v: string | number) {
  return String(startOfDay(toDate(v)));
}

/** "Today", "Yesterday" or "Friday, Jun 13" */
export function formatDayLabel(v: string | number) {
  const d = toDate(v);
  const diff = Math.round((startOfDay(new Date()) - startOfDay(d)) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return dayFmt.format(d);
}

/** Conversation list stamp: time if today, otherwise "Jun 13" */
export function formatListStamp(v: string | number) {
  const d = toDate(v);
  return startOfDay(d) === startOfDay(new Date())
    ? timeFmt.format(d)
    : shortFmt.format(d);
}
