"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStomp } from "@/providers/StompProvider";
import { Message } from "@/features/messages/messages.types";

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const { connected, subscribe, publish } = useStomp();
  const [messages, setMessages] = useState<Message[]>([]);

  // Subscribe to this conversation
  useEffect(() => {
    if (!connected) return;

    const unsubscribe = subscribe(`/topic/conversation/${id}`, (frame) => {
      const message: Message = JSON.parse(frame.body);
      setMessages((prev) => [...prev, message]);
    });

    return () => unsubscribe?.();
  }, [connected, id, subscribe]);

  // Send a message
  function send(content: string) {
    publish(`/app/conversation/${id}`, { content });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.messageId}>{m.content}</div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const input = form.elements.namedItem("content") as HTMLInputElement;
          send(input.value);
          input.value = "";
        }}
        className="border-t p-3"
      >
        <input
          name="content"
          autoComplete="off"
          className="w-full rounded border p-2"
        />
      </form>
    </div>
  );
}
