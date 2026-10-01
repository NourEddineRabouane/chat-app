// this is a provider of our conversation store created by zustand
"use client";

import { type ReactNode, createContext, useState, useContext } from "react";
import { useStore } from "zustand";

import {
  type ConversationState,
  createConversationStore,
} from "@/store/conversation.sotre";

export type ConversationStoreApi = ReturnType<typeof createConversationStore>;

export const ConversationStoreContext = createContext<
  ConversationStoreApi | undefined
>(undefined);

export interface ConversationStoreProviderProps {
  children: ReactNode;
}

export const ConversationStoreProvider = ({
  children,
}: ConversationStoreProviderProps) => {
  const [store] = useState(() => createConversationStore());
  return (
    <ConversationStoreContext.Provider value={store}>
      {children}
    </ConversationStoreContext.Provider>
  );
};

export const useConversationStore = <T,>(
  selector: (store: ConversationState) => T,
): T => {
  const conversationStoreContext = useContext(ConversationStoreContext);
  if (!conversationStoreContext) {
    throw new Error(
      `useConversationStore must be used within ConversationStoreProvider`,
    );
  }

  return useStore(conversationStoreContext, selector);
};
