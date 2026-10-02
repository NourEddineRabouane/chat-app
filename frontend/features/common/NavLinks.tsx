"use client";

import {
  House,
  MessageCircleMore,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/chat", label: "Chat", icon: MessageCircleMore },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export default function NavLinks() {
  const pathname = usePathname();

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
          </Link>
        );
      })}
    </nav>
  );
}
