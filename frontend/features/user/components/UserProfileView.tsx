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
  "mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-mint-600 focus:ring-4 focus:ring-mint-600/15";

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
      <div className="grid min-h-full place-items-center p-6">
        <LoaderCircle className="size-8 animate-spin text-mint-600" aria-label="Loading profile" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <section className="min-h-full px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-mint-600">
            Account settings
          </p>
          <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">
            Your profile
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-900/60 sm:text-base">
            Keep your details up to date so friends know who they&apos;re chatting with.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)]">
          <aside className="rounded-3xl bg-mint-50 p-6 text-ink-900 sm:p-8">
            <div className="grid size-20 place-items-center rounded-3xl bg-mint-400 text-3xl font-bold text-mint-900">
              {profile && initials(profile.username, profile.email)}
            </div>
            <h2 className="mt-6 break-words text-2xl font-bold">
              {profile?.username || "Your account"}
            </h2>
            <p className="mt-1 break-all text-sm text-ink-600">{profile?.email}</p>
            {profile && (
              <div className="mt-8 flex items-start gap-3 border-t border-mint-100 pt-5 text-sm text-ink-600">
                <CalendarDays className="mt-0.5 size-4 flex-none text-mint-600" />
                <span>Member since {formatCreatedAt(profile.createdAt)}</span>
              </div>
            )}
          </aside>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-line bg-white p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 border-b border-line pb-5">
              <div className="grid size-10 place-items-center rounded-xl bg-mint-600/15 text-mint-600">
                <PencilLine className="size-5" />
              </div>
              <div>
                <h2 className="font-bold text-ink-900">Personal information</h2>
                <p className="text-sm text-ink-900/55">Only you can see and edit these details.</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <label className="block text-sm font-semibold text-ink-900">
                Username
                <span className="relative block">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
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

              <label className="block text-sm font-semibold text-ink-900">
                Email address
                <span className="relative block">
                  <AtSign className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
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
              <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl bg-danger-soft px-3 py-2.5 text-sm text-danger">
                <AlertCircle className="mt-0.5 size-4 flex-none" />
                {error}
              </p>
            )}
            {success && (
              <p role="status" className="mt-5 flex items-center gap-2 rounded-xl bg-mint-600/10 px-3 py-2.5 text-sm text-ink-900">
                <Check className="size-4 text-mint-600" />
                {success}
              </p>
            )}

            <div className="mt-7 flex justify-end">
              <button
                type="submit"
                disabled={isSaving || !hasChanges}
                className="inline-flex items-center gap-2 rounded-xl bg-mint-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-mint-700 disabled:cursor-not-allowed disabled:opacity-45"
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
