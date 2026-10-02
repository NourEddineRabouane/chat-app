import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import NavLinks from "./NavLinks";
import img from "@/public/icon.svg";

export default async function Navbar() {
  const session = await getServerSession();
  const email = session?.user?.email;
  
  if (!email) return;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-16 flex-col items-center justify-between bg-navy-950 py-5 text-text-muted">
      <Logo />

      <NavLinks />

      {/* Bottom: user avatar, or login */}
      <div
        title={email}
        className="grid size-9 place-items-center rounded-full bg-accent-teal/15 text-sm font-medium uppercase text-accent-teal"
      >
        {email[0]}
      </div>
    </aside>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      aria-label="Accueil"
      title="Accueil"
      className="transition-transform hover:scale-105"
    >
      <Image src={img} alt="Logo" width={40} height={40} priority />
    </Link>
  );
}
