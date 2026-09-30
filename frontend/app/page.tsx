"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading application state...</p>;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/backend-logout", { method: "POST" });

    signOut({ callbackUrl: "/login" });
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard Area</h1>
      <p>
        Hello, <strong>{session?.user?.name}</strong> ({session?.user?.email})
      </p>
      <p>
        Your user index reference identification matches string:{" "}
        {session?.user?.id}
      </p>
      <button
        onClick={handleLogout}
        style={{
          background: "red",
          color: "white",
          padding: "8px 12px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Log Out Safely
      </button>
    </div>
  );
}
