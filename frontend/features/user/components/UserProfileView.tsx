"use client";

import {
  AlertCircle,
  AtSign,
  CalendarDays,
  Check,
  LoaderCircle,
  PencilLine,
  Save,
  UserRound,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getCurrentProfile,
  updateCurrentProfile,
} from "@/features/user/user-profile.api";
import type { UserProfile } from "@/features/user/user.types";

const inputClassName =
  "mt-2 w-full rounded-xl border border-navy-950/10 bg-white px-4 py-3 text-sm text-navy-950 outline-none transition placeholder:text-text-muted focus:border-accent-teal focus:ring-4 focus:ring-accent-teal/15";

function formatCreatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function initials(username: string, email: string) {
  return (username || email).trim().charAt(0).toUpperCase() || "?";
}

export default function UserProfileView() {
  const router = useRouter();
  const { status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status !== "authenticated") return;

    let active = true;
    getCurrentProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setUsername(data.username);
        setEmail(data.email);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load your profile.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router, status]);

  const hasChanges = useMemo(
    () => profile !== null && (username !== profile.username || email !== profile.email),
    [email, profile, username],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile || !hasChanges) return;

    setError("");
    setSuccess("");
    setIsSaving(true);
    try {
      const updated = await updateCurrentProfile({
        username: username.trim(),
        email: email.trim(),
      });
      setProfile(updated);
      setUsername(updated.username);
      setEmail(updated.email);
      setSuccess("Your profile was updated.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to update your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="grid min-h-[calc(100vh-2rem)] place-items-center p-6">
        <LoaderCircle className="size-8 animate-spin text-accent-teal" aria-label="Loading profile" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <section className="min-h-[calc(100vh-2rem)] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent-teal">
            Account settings
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
            Your profile
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-navy-950/60 sm:text-base">
            Keep your details up to date so friends know who they&apos;re chatting with.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)]">
          <aside className="rounded-3xl bg-navy-950 p-6 text-white shadow-xl shadow-navy-950/10 sm:p-8">
            <div className="grid size-20 place-items-center rounded-3xl bg-accent-teal text-3xl font-bold text-navy-950">
              {profile && initials(profile.username, profile.email)}
            </div>
            <h2 className="mt-6 break-words text-2xl font-bold">
              {profile?.username || "Your account"}
            </h2>
            <p className="mt-1 break-all text-sm text-white/60">{profile?.email}</p>
            {profile && (
              <div className="mt-8 flex items-start gap-3 border-t border-white/10 pt-5 text-sm text-white/70">
                <CalendarDays className="mt-0.5 size-4 flex-none text-accent-teal" />
                <span>Member since {formatCreatedAt(profile.createdAt)}</span>
              </div>
            )}
          </aside>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-xl shadow-navy-950/5 sm:p-8"
          >
            <div className="flex items-center gap-3 border-b border-navy-950/10 pb-5">
              <div className="grid size-10 place-items-center rounded-xl bg-accent-teal/15 text-accent-teal">
                <PencilLine className="size-5" />
              </div>
              <div>
                <h2 className="font-bold text-navy-950">Personal information</h2>
                <p className="text-sm text-navy-950/55">Only you can see and edit these details.</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <label className="block text-sm font-semibold text-navy-950">
                Username
                <span className="relative block">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                  <input
                    className={`${inputClassName} pl-11`}
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    minLength={2}
                    maxLength={50}
                    required
                    autoComplete="username"
                  />
                </span>
              </label>

              <label className="block text-sm font-semibold text-navy-950">
                Email address
                <span className="relative block">
                  <AtSign className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                  <input
                    className={`${inputClassName} pl-11`}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                  />
                </span>
              </label>
            </div>

            {error && (
              <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 size-4 flex-none" />
                {error}
              </p>
            )}
            {success && (
              <p role="status" className="mt-5 flex items-center gap-2 rounded-xl bg-accent-teal/10 px-3 py-2.5 text-sm text-navy-950">
                <Check className="size-4 text-accent-teal" />
                {success}
              </p>
            )}

            <div className="mt-7 flex justify-end">
              <button
                type="submit"
                disabled={isSaving || !hasChanges}
                className="inline-flex items-center gap-2 rounded-xl bg-accent-teal px-5 py-3 text-sm font-bold text-navy-950 transition hover:bg-accent-teal/85 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isSaving && <LoaderCircle className="size-4 animate-spin" />}
                <Save className="size-4" />
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
