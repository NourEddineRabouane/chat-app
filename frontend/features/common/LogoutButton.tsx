"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch("/api/backend-logout", { method: "POST" });
    } finally {
      // Always clear the local session, even if the backend call failed
      await signOut({ callbackUrl: "/login" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      title="Log out"
      aria-label="Log out"
      className="grid size-11 cursor-pointer place-items-center rounded-xl text-ink-400 transition-colors hover:bg-mint-50 hover:text-mint-600"
    >
      <LogOut className="size-5" strokeWidth={1.75} />
    </button>
  );
}
