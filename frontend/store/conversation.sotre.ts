import { Conversation } from "@/features/conversations/conversations.types";
import { createStore } from "zustand";

export interface ConversationState {
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void;
  clearSelectedConversation: () => void;
}

export const createConversationStore = () => {
  return createStore<ConversationState>()((set) => ({
    selectedConversation: null,

    setSelectedConversation: (conversation) =>
      set({ selectedConversation: conversation }),

    clearSelectedConversation: () => set({ selectedConversation: null }),
  }));
};
