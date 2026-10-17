import type { ReactNode } from "react";
import type { UserSummary } from "../friendship.types";
import { Avatar } from "@/features/user/components/Avatar";

export function UserAvatar({ user }: { user: UserSummary }) {
  return <Avatar id={user.id} name={user.username} size="md" presence />;
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
        <p className="truncate text-sm font-medium text-ink-900">
          {user.username}
        </p>
        {subtitle && (
          <p className="truncate text-xs text-ink-400">{subtitle}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}

/** White rounded card with dividers: wrap a list of <li><UserRow/></li> in it. */
export function Card({ children }: { children: ReactNode }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
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
          ? "border-danger text-danger"
          : "border-line text-ink-400"
      }`}
    >
      {children}
    </p>
  );
}

export function ActionError({ error }: { error: Error | null }) {
  if (!error) return null;
  return (
    <p role="alert" className="mt-2 text-sm text-danger">
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
      className="mx-auto mt-3 block rounded-full px-4 py-2 text-sm font-medium text-mint-600 transition hover:bg-mint-600/10 disabled:opacity-60"
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
export const primaryButton = `${buttonBase} bg-mint-600 text-white hover:brightness-95`;
export const ghostButton = `${buttonBase} border border-line text-ink-900 hover:bg-mint-50`;
