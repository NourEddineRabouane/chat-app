"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageCircleMore, UserRound, Users } from "lucide-react";

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const tiles = [
  { href: "/chat", label: "Conversations", hint: "Pick up where you left off", icon: MessageCircleMore },
  { href: "/friends", label: "Friends", hint: "Find someone to talk to", icon: Users },
  { href: "/profile", label: "Profile", hint: "Edit how you show up", icon: UserRound },
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return <p className="p-6 text-ink-400">Loading…</p>;
  if (status === "unauthenticated") return null;

  const email = session?.user?.email ?? "";
  const name = session?.user?.name || email.split("@")[0] || "there";

  return (
    <div className="mx-auto max-w-3xl p-6 sm:p-10">
      <p className="text-ink-400">{greeting()},</p>
      <h1 className="mt-1 break-words text-4xl font-bold text-ink-900 sm:text-5xl">
        {name}
      </h1>
      <p className="mt-2 text-ink-600">Your people are one tap away.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {tiles.map(({ href, label, hint, icon: Icon }, i) => (
          <Link
            key={href}
            href={href}
            className={`rounded-2xl p-5 transition-colors ${
              i === 0
                ? "bg-mint-400 text-mint-900 shadow-bubble-in hover:bg-mint-300 sm:col-span-3"
                : "bg-panel text-ink-900 hover:bg-mint-50"
            }`}
          >
            <Icon className="mb-5 size-6" strokeWidth={1.75} />
            <b className="block text-base">{label}</b>
            <span className={`text-[13px] ${i === 0 ? "text-mint-900/80" : "text-ink-600"}`}>
              {hint}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
