"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clientApi } from "@/lib/api/clientApi";
import { fieldClass, submitClass } from "@/features/auth/styles";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      // Uses the configured backend URL instead of a hard-coded localhost
      const res = await clientApi("/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        setError((await res.text()) || "Sign up failed. Check your details and try again.");
      }
    } catch {
      setError("Can't reach the server. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-ink-900">Create your account</h1>
      <p className="mb-6 mt-1 text-sm text-ink-400">It takes less than a minute.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input aria-label="Username" placeholder="Username" autoComplete="username" required minLength={2} maxLength={50} onChange={set("username")} className={fieldClass} />
        <input type="email" aria-label="Email" placeholder="Email" autoComplete="email" required onChange={set("email")} className={fieldClass} />
        <input type="password" aria-label="Password" placeholder="Password (8+ characters)" autoComplete="new-password" required minLength={8} onChange={set("password")} className={fieldClass} />
        {error && (
          <p role="alert" className="px-2 text-sm text-danger">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={submitClass}>
          {busy ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-mint-600 hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
