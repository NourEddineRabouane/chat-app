"use client";

import {
  House,
  MessageCircleMore,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIncomingCount } from "@/features/friendship/friendship.queries";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/chat", label: "Chat", icon: MessageCircleMore },
  { href: "/friends", label: "Friends", icon: Users },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { data: pendingRequests = 0 } = useIncomingCount();

  return (
    <nav aria-label="Main" className="flex flex-col gap-3">
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            title={label}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`relative grid size-11 place-items-center rounded-xl transition-colors ${
              active
                ? "bg-mint-100 text-mint-600"
                : "text-ink-400 hover:bg-mint-50 hover:text-mint-600"
            }`}
          >
            <Icon className="size-5" strokeWidth={1.75} />
            {href === "/friends" && pendingRequests > 0 && (
              <span
                aria-label={`${pendingRequests} pending friend requests`}
                className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-mint-600 px-1 text-[10px] font-bold leading-4 text-white"
              >
                {pendingRequests > 9 ? "9+" : pendingRequests}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
