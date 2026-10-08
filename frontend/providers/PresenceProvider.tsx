"use client";

import { clientApi } from "@/lib/api/clientApi";
import { useStomp } from "@/providers/StompProvider";
import type { IMessage } from "@stomp/stompjs";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Status = "online" | "offline";
type PresenceMap = Record<string, Status>;

type Ctx = {
  presence: PresenceMap;
  isOnline: (userId: string | number) => boolean;
};

const PresenceContext = createContext<Ctx | null>(null);

// Backend TTL is 30s → beat every 10s so a single dropped packet never expires us.
const HEARTBEAT_MS = 10_000;

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const { connected, subscribe, publish } = useStomp();
  const [presence, setPresence] = useState<PresenceMap>({});

  // 1) Subscribe to my friends' transitions.
  useEffect(() => {
    if (!connected) return;
    const unsub = subscribe("/user/queue/presence", (msg: IMessage) => {
      try {
        console.log("I get this from backend : " + msg);
        const evt = JSON.parse(msg.body) as { userId: number; status: Status };
        setPresence((p) => ({ ...p, [String(evt.userId)]: evt.status }));
      } catch (e) {
        console.error("Bad presence payload", msg.body, e);
      }
    });
    return () => unsub?.();
  }, [connected, subscribe]);

  // 2) Heartbeat loop.
  useEffect(() => {
    if (!connected) return;
    const beat = () => publish("/app/heartbeat", null);
    beat(); // immediately on (re)connect
    const id = window.setInterval(beat, HEARTBEAT_MS);
    return () => window.clearInterval(id);
  }, [connected, publish]);

  // 3) Initial snapshot — AFTER subscribing so we don't miss the window.
  useEffect(() => {
    if (!connected) return;
    let cancelled = false;
    clientApi("/api/presence/friends")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((onlineIds: number[]) => {
        if (cancelled) return;
        setPresence((prev) => {
          const next = { ...prev };
          for (const id of onlineIds) next[String(id)] = "online";
          return next;
        });
      })
      .catch((err) => console.error("presence snapshot failed", err));
    return () => {
      cancelled = true;
    };
  }, [connected]);

  const value = useMemo<Ctx>(
    () => ({
      presence,
      isOnline: (id) => presence[String(id)] === "online",
    }),
    [presence],
  );

  return (
    <PresenceContext.Provider value={value}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence() {
  const ctx = useContext(PresenceContext);
  if (!ctx)
    throw new Error("usePresence must be used inside <PresenceProvider>");
  return ctx;
}

/** Re-renders ONLY when this specific user's status flips. */
export function useFriendPresence(userId: string | number) {
  const { presence } = usePresence();
  return (presence[String(userId)] ?? "offline") as Status;
}
