"use client";
import { useFriendPresence } from "@/providers/PresenceProvider";

export function StatusDot({
  userId,
  size = 10,
}: {
  userId: string | number;
  size?: number;
}) {
  const status = useFriendPresence(userId);

  console.log(status);
  return (
    <span
      aria-label={status}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: status === "online" ? "#22c55e" : "#9ca3af",
      }}
    />
  );
}
