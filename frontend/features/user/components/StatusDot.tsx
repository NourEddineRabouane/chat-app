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
      role="img"
      aria-label={status}
      title={status}
      className={`inline-block rounded-full ring-2 ring-surface ${
        status === "online" ? "bg-online" : "bg-offline"
      } ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
