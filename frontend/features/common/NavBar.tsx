import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import NavLinks from "./NavLinks";
import LogoutButton from "./LogoutButton";
import img from "@/public/icon.svg";

export default async function Navbar() {
  const session = await getServerSession();
  const email = session?.user?.email;

  if (!email) return null;

  return (
    <aside className="z-10 flex w-14 shrink-0 flex-col items-center justify-between border-r border-line bg-surface py-5 sm:w-[72px]">
      <div className="flex flex-col items-center gap-8">
        <Link
          href="/"
          aria-label="Home"
          title={email}
          className="transition-transform hover:scale-105"
        >
          <Image src={img} alt="Logo" width={36} height={36} priority />
        </Link>
        <NavLinks />
      </div>

      <LogoutButton />
    </aside>
  );
}
