"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStomp } from "@/providers/StompProvider";
import {
  Message,
  SendMessagePayload,
} from "@/features/messages/messages.types";
import { useSession } from "next-auth/react";
import { useConversationStore } from "@/providers/ConversationStoreProvider";

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const { data } = useSession();
  const { connected, subscribe, publish } = useStomp();
  const [messages, setMessages] = useState<Message[]>([]);
  // selected conversation
  const { selectedConversation } = useConversationStore((s) => s);
  // Subscribe to this conversation
  useEffect(() => {
    if (!connected) return;

    const unsubscribe = subscribe(`/user/queue/messages`, (frame) => {
      const message: Message = JSON.parse(frame.body);
      setMessages((prev) => [...prev, message]);
    });

    return () => unsubscribe?.();
  }, [connected, id, subscribe]);


  const handleSendMessage = (content: string) => {
    console.log(data?.user.id);
    console.log(selectedConversation?.firstUser.id);
    console.log(selectedConversation?.secondUser.id);
    const payload: SendMessagePayload = {
      conversationId: Number(selectedConversation?.id),
      senderId: Number(data?.user.id),
      receiverId: Number(
        selectedConversation?.firstUser.id == data?.user.id
          ? selectedConversation?.secondUser.id
          : selectedConversation?.firstUser.id,
      ),

      content,
      createdAt: Date.now(),
    };

    publish("/app/chat.privateMessage", payload);
  };

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
          handleSendMessage(input.value);
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
