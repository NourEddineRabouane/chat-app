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
    <nav aria-label="Main" className="flex flex-col gap-2">
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
            className={`relative flex h-12  items-center justify-center transition-colors ${
              active
                ? "text-white bg-navy-900 rounded-xl w-12"
                : "text-text-muted hover:text-white "
            }`}
          >
            <Icon className="size-6" strokeWidth={1.75} />
            {href === "/friends" && pendingRequests > 0 && (
              <span
                aria-label={`${pendingRequests} pending friend requests`}
                className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-accent-orange px-1 text-[10px] font-bold leading-4 text-navy-950"
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
