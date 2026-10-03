import type { ReactNode } from "react";
import type { UserSummary } from "../friendship.types";

const AVATAR_COLORS = [
  "bg-accent-teal",
  "bg-accent-orange",
  "bg-navy-900",
  "bg-blue-600",
];

export function UserAvatar({ user }: { user: UserSummary }) {
  const color = AVATAR_COLORS[user.id % AVATAR_COLORS.length];
  return (
    <div
      aria-hidden="true"
      className={`grid size-11 shrink-0 place-items-center rounded-full text-base font-medium text-white shadow-sm ${color}`}
    >
      {(user.username || "?")[0].toUpperCase()}
    </div>
  );
}

/** Avatar + name + optional subtitle on the left, actions on the right. */
export function UserRow({
  user,
  subtitle,
  children,
}: {
  user: UserSummary;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <UserAvatar user={user} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-navy-950">
          {user.username}
        </p>
        {subtitle && (
          <p className="truncate text-xs text-text-muted">{subtitle}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}

/** White rounded card with dividers: wrap a list of <li><UserRow/></li> in it. */
export function Card({ children }: { children: ReactNode }) {
  return (
    <ul className="divide-y divide-text-muted/20 overflow-hidden rounded-2xl bg-surface shadow-sm">
      {children}
    </ul>
  );
}

export function StateMessage({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "error";
}) {
  return (
    <p
      role={tone === "error" ? "alert" : undefined}
      className={`rounded-2xl border border-dashed p-6 text-center text-sm ${
        tone === "error"
          ? "border-red-300 text-red-600"
          : "border-text-muted/40 text-text-muted"
      }`}
    >
      {children}
    </p>
  );
}

export function ActionError({ error }: { error: Error | null }) {
  if (!error) return null;
  return (
    <p role="alert" className="mt-2 text-sm text-red-600">
      {error.message}
    </p>
  );
}

export function LoadMore({
  hasNextPage,
  loading,
  onClick,
}: {
  hasNextPage: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  if (!hasNextPage) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="mx-auto mt-3 block rounded-full px-4 py-2 text-sm font-medium text-accent-teal transition hover:bg-accent-teal/10 disabled:opacity-60"
    >
      {loading ? "Loading..." : "Load more"}
    </button>
  );
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const buttonBase =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50";
export const primaryButton = `${buttonBase} bg-accent-teal text-white hover:brightness-95`;
export const ghostButton = `${buttonBase} border border-text-muted/40 text-navy-950 hover:bg-bubble-incoming`;
