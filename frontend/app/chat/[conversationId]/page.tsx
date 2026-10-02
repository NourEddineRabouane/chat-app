"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useStomp } from "@/providers/StompProvider";
import {
  Message,
  SendMessagePayload,
} from "@/features/messages/messages.types";
import { useSession } from "next-auth/react";
import { Conversation } from "@/features/conversations/conversations.types";
import { clientApi } from "@/lib/api/clientApi";
// Remove Zustand import. Use a fetch call to get conversation details based on the ID.

export default function ConversationPage() {
  // Fix: Match the folder structure parameter name [conversationId]
  const { conversationId } = useParams<{ conversationId: string }>();
  const { data: session } = useSession();
  const { connected, subscribe, publish } = useStomp();

  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages]);

  // Fetch initial chat history and conversation metadata based on URL ID
  useEffect(() => {
    if (!conversationId) return;
    async function getRessources() {
      const [cRes, cmRes] = await Promise.all([
        clientApi(`/api/conversations/${conversationId}`),
        clientApi(`/api/conversations/${conversationId}/messages`),
      ]);

      console.table(cRes);
      console.table(cmRes);

      const c = await cRes.json();
      const cm = await cmRes.json();

      setActiveConversation(c);
      setMessages(cm);
    }

    getRessources();
    
  }, [conversationId]);

  useEffect(() => {
    if (!connected || !conversationId) return;

    const unsubscribe = subscribe(`/user/queue/messages`, (frame) => {
      const message: Message = JSON.parse(frame.body);
      if (Number(message.conversationId) === Number(conversationId)) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => unsubscribe?.();
  }, [connected, conversationId, subscribe]);

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !activeConversation || !session?.user?.id) return;

    const currentUserId = String(session.user.id);
    const firstUserId = String(activeConversation.firstUser.id);
    const secondUserId = String(activeConversation.secondUser.id);
    const receiverId = Number(
      currentUserId === firstUserId ? secondUserId : firstUserId,
    );

    const payload: SendMessagePayload = {
      conversationId: Number(conversationId),
      senderId: Number(currentUserId),
      receiverId: receiverId,
      content: content.trim(),
      createdAt: Date.now(),
    };

    publish("/app/chat.privateMessage", payload);

    const localMessage: Message = {
      messageId: Date.now(),
      senderId: payload.senderId,
      conversationId: payload.conversationId,
      content: payload.content,
      createdAt: new Date().toISOString(), // Fix: Invalid getMilliseconds()
    };
    setMessages((prev) => [...prev, localMessage]);
  };

  if (!activeConversation)
    return <div className="p-8 text-center text-gray-500">Loading chat...</div>;

  return (
    <>
      <div className="flex items-center border-b bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          {String(activeConversation.firstUser.id) === String(session?.user?.id)
            ? activeConversation.secondUser.username
            : activeConversation.firstUser.username}
        </h2>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m, idx) => {
          const isMe = String(m.senderId) === String(session?.user?.id);
          return (
            <div
              key={m.messageId || idx}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border rounded-bl-none"
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const input = form.elements.namedItem("content") as HTMLInputElement;
          handleSendMessage(input.value);
          input.value = "";
        }}
        className="flex gap-2 border-t bg-white p-3"
      >
        <input
          name="content"
          autoComplete="off"
          placeholder="Type your message..."
          className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-95"
        >
          Send
        </button>
      </form>
    </>
  );
}
