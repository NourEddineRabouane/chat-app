"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fieldClass, submitClass } from "@/features/auth/styles";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setBusy(false);

    if (result?.error) {
      setError("Wrong email or password.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-ink-900">Welcome back</h1>
      <p className="mb-6 mt-1 text-sm text-ink-400">Log in to continue chatting.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          aria-label="Email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={fieldClass}
        />
        <input
          type="password"
          aria-label="Password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={fieldClass}
        />
        {error && (
          <p role="alert" className="px-2 text-sm text-danger">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={submitClass}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-mint-600 hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
