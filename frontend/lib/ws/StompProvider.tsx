"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
// import { useChatStore } from "@/store/chatStore";

const StompContext = createContext<Client | undefined>(undefined);
export const useStomp = () => useContext(StompContext);

export function StompProvider({ children }: { children: React.ReactNode }) {
  const clientRef = useRef<Client | undefined>(undefined);
  const [current, setCurrent] = useState<Client>();
  //   const handleIncoming = useChatStore((s) => s.handleIncomingMessage);

  useEffect(() => {
    const client = new Client({
      brokerURL: process.env.NEXT_PUBLIC_WS_URL, // ws://localhost:8080/ws/websocket
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        // the one global subscription — see note above
        client.subscribe("/user/queue/messages", (msg) => {
          //   handleIncoming(JSON.parse(msg.body));
          console.log(msg);
        });
      },
    });
    client.activate();
    // clientRef.current = client;
    if (client)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrent(client);

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <StompContext.Provider value={current}>{children}</StompContext.Provider>
  );
}
