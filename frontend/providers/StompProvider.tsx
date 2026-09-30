"use client";

import { Client, type IMessage } from "@stomp/stompjs";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type StompContextValue = {
  connected: boolean;
  subscribe: (
    destination: string,
    handler: (msg: IMessage) => void,
  ) => (() => void) | null;
  publish: (destination: string, body: unknown) => void;
};

const StompContext = createContext<StompContextValue | null>(null);

export function StompProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function connect() {
      const res = await fetch("/api/ws-token");

      if (!res.ok) {
        console.error("Failed to fetch WS token");
        return;
      }
      const { token } = await res.json();
      if (cancelled) return;

      const client = new Client({
        brokerURL: process.env.NEXT_PUBLIC_STOMP_URL,
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
      });

      client.onConnect = () => setConnected(true);
      client.onDisconnect = () => setConnected(false);

      client.activate();
      clientRef.current = client;
    }

    connect();

    return () => {
      cancelled = true;
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, []);

  const value = useMemo<StompContextValue>(
    () => ({
      connected,
      subscribe: (dest, handler) => {
        const c = clientRef.current;
        if (!c?.connected) return null;
        const sub = c.subscribe(dest, handler);
        return () => sub.unsubscribe();
      },
      publish: (dest, body) => {
        const c = clientRef.current;
        if (!c?.connected) return;
        c.publish({ destination: dest, body: JSON.stringify(body) });
      },
    }),
    [connected],
  );

  return (
    <StompContext.Provider value={value}>{children}</StompContext.Provider>
  );
}

export function useStomp() {
  const ctx = useContext(StompContext);
  if (!ctx) throw new Error("useStomp must be used inside <StompProvider>");
  return ctx;
}
