"use client";
import { useFriendPresence } from "@/providers/PresenceProvider";

export function StatusDot({
  userId,
  size = 10,
  className = "",
}: {
  userId: string | number;
  size?: number;
  className?: string;
}) {
  const status = useFriendPresence(userId);

  return (
    <span
      aria-label={status}
      title={status}
      className={`inline-block rounded-full ring-2 ring-white ${className}`}
      style={{
        width: size,
        height: size,
        background: status === "online" ? "#22c55e" : "#9ca3af",
      }}
    />
  );
}
