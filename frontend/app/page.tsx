"use client";

import { useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#12122b]";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return <p className="p-3.5">Loading…</p>;
  if (status === "unauthenticated") return null;

  const email = session?.user?.email ?? "";
  const name = session?.user?.name || email.split("@")[0] || "there";
  const initial = name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await fetch("/api/backend-logout", { method: "POST" });
    signOut({ callbackUrl: "/login" });
  };

  const tile =
    "flex flex-col gap-0.5 rounded-2xl p-3.5 text-white no-underline transition-transform hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0";
  const icon =
    "mb-[18px] h-[26px] w-[26px] fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]";

  return (
    <main className="grid max-w-230 gap-2.5 p-3.5 text-[#12122b]">
      {/* hero */}
      <section className="hm-hero relative min-h-52.5 overflow-hidden rounded-[22px] px-5.5 pb-6 pt-5.5 text-white">
        <div className="relative z-10 max-w-full sm:max-w-[55%]">
          <p className="m-0 text-[15px] opacity-85">{greeting()},</p>
          <h1 className="m-0 wrap-break-word text-[clamp(34px,6vw,56px)] font-bold leading-none tracking-[-0.03em]">
            {name}
          </h1>
          <p className="mb-4 mt-2.5 text-[15px] opacity-90">
            Your people are one tap away.
          </p>
          <Link
            href="/chat"
            className={`inline-block rounded-full bg-[#ffe14a] px-4 py-2.25 text-sm font-bold text-[#12122b] no-underline transition-transform hover:-translate-y-0.5 hover:-rotate-1 motion-reduce:transition-none motion-reduce:hover:transform-none ${focusRing}`}
          >
            Open conversations
          </Link>
        </div>

        {/* decorative bubbles, deliberately a bit crooked */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden sm:block"
        >
          <span className="absolute right-[8%] top-[16%] -rotate-3 whitespace-nowrap rounded-[18px] rounded-bl bg-white px-3.5 py-2.25 text-sm text-[#12122b] shadow-[0_6px_18px_rgba(18,18,43,0.28)]">
            hey, you around?
          </span>
          <span className="absolute right-[4%] top-[42%] rotate-2 whitespace-nowrap rounded-[18px] rounded-br bg-[#12122b] px-3.5 py-2.25 text-sm text-white shadow-[0_6px_18px_rgba(18,18,43,0.28)]">
            always
          </span>
          <span className="absolute right-[16%] top-[68%] rotate-[-1.5deg] whitespace-nowrap rounded-[18px] rounded-br bg-[#19e3b1] px-3.5 py-2.25 text-sm font-semibold text-[#12122b] shadow-[0_6px_18px_rgba(18,18,43,0.28)]">
            send it over
          </span>
        </div>
      </section>

      {/* tiles */}
      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-[1.6fr_1fr_1fr]">
        <Link
          href="/chat"
          className={`${tile} col-span-2 bg-[#12122b] sm:col-span-1 ${focusRing}`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`${icon} text-[#19e3b1]`}
          >
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
          </svg>
          <b className="text-base">Conversations</b>
          <span className="text-[13px] opacity-85">
            Pick up where you left off
          </span>
        </Link>

        <Link href="/people" className={`${tile} bg-[#ff3d8b] ${focusRing}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={icon}>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20c.6-3.6 3-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .6 3.2 2.3 3.5 5.2" />
          </svg>
          <b className="text-base">People</b>
          <span className="text-[13px] opacity-85">
            Find someone to talk to
          </span>
        </Link>

        <Link
          href="/profile"
          className={`${tile} bg-[#19e3b1] text-[#12122b]! ${focusRing}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className={icon}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c.8-4.2 4-6 8-6s7.2 1.8 8 6" />
          </svg>
          <b className="text-base">Profile</b>
          <span className="text-[13px] opacity-85">Edit how you show up</span>
        </Link>
      </section>

      {/* account strip */}
      <section className="flex items-center gap-2.5 rounded-2xl bg-white/70 py-2 pl-2.5 pr-2 backdrop-blur-sm">
        <div className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#1a56f0] font-bold text-white">
          {initial}
        </div>
        <div className="grid min-w-0 flex-1">
          <b className="truncate text-sm">{email}</b>
          <span className="text-xs opacity-60">ID {session?.user?.id}</span>
        </div>
        <button
          onClick={handleLogout}
          className={`cursor-pointer rounded-full border-2 border-[#12122b] bg-transparent px-3 py-1.5 text-[13px] font-semibold text-[#12122b] transition-colors hover:border-[#ff3d8b] hover:bg-[#ff3d8b] hover:text-white ${focusRing}`}
        >
          Log out
        </button>
      </section>
    </main>
  );
}
