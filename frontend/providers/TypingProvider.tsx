"use client";

import { useStomp } from "@/providers/StompProvider";
import type { IMessage } from "@stomp/stompjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type TypingEntry = { userId: number; expiresAt: number };
type TypingMap = Record<string, TypingEntry>; // key = conversationId (as string)

type Ctx = {
  /** Returns the userId currently typing in a conversation, or null. */
  typingIn: (conversationId: number | string) => number | null;
  /** Notify the server you're typing. Throttled to once per 2s. */
  notifyTyping: (conversationId: number, toUserId: number) => void;
};

const TypingContext = createContext<Ctx | null>(null);

const TYPING_TTL_MS = 3000; // hide indicator after 3s of silence
const THROTTLE_MS = 2000; // send at most one event every 2s
const SWEEP_INTERVAL_MS = 1000; // how often to check for expired entries

export function TypingProvider({ children }: { children: React.ReactNode }) {
  const { connected, subscribe, publish } = useStomp();
  const [map, setMap] = useState<TypingMap>({});

  // Per-conversation "last time I sent a typing event" — ref, not state, so it doesn't re-render
  const lastSentRef = useRef<Record<string, number>>({});

  // 1) Subscribe to incoming typing events
  useEffect(() => {
    if (!connected) return;
    const unsub = subscribe("/user/queue/typing", (msg: IMessage) => {
      try {
        const e = JSON.parse(msg.body) as {
          fromUserId: number;
          conversationId: number;
          status: string;
        };
        const key = String(e.conversationId);
        setMap((m) => ({
          ...m,
          [key]: {
            userId: e.fromUserId,
            expiresAt: Date.now() + TYPING_TTL_MS,
          },
        }));
      } catch (err) {
        console.error("Bad typing payload", msg.body, err);
      }
    });
    return () => unsub?.();
  }, [connected, subscribe]);

  // 2) Sweep expired entries every second (one interval, no per-entry timers)
  useEffect(() => {
    const id = window.setInterval(() => {
      setMap((m) => {
        const now = Date.now();
        let changed = false;
        const next: TypingMap = {};
        for (const [k, v] of Object.entries(m)) {
          if (v.expiresAt > now) next[k] = v;
          else changed = true;
        }
        return changed ? next : m;
      });
    }, SWEEP_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const notifyTyping = useCallback(
    (conversationId: number, toUserId: number) => {
      const key = String(conversationId);
      const now = Date.now();
      const last = lastSentRef.current[key] ?? 0;
      if (now - last < THROTTLE_MS) return;
      lastSentRef.current[key] = now;

      publish("/app/typing", {
        toUserId,
        conversationId,
        status: "TYPING",
      });
    },
    [publish],
  );

  const value = useMemo<Ctx>(
    () => ({
      typingIn: (id) => map[String(id)]?.userId ?? null,
      notifyTyping,
    }),
    [map, notifyTyping],
  );

  return (
    <TypingContext.Provider value={value}>{children}</TypingContext.Provider>
  );
}

export function useTyping() {
  const ctx = useContext(TypingContext);
  if (!ctx) throw new Error("useTyping must be used inside <TypingProvider>");
  return ctx;
}

export function useTypingIn(conversationId: number | string) {
  const { typingIn } = useTyping();
  return typingIn(conversationId);
}
