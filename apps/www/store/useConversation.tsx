import { Conversation } from "@workspace/types";
import { create } from "zustand";

interface ConversationStore {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  setTitle: (title: string, id: string) => void;
  fetch: () => Promise<void>;
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  setTitle: (title: string, id: string) =>
    set({
      conversations: get().conversations.map((conversation) =>
        conversation.id === id ? { ...conversation, title } : conversation,
      ),
    }),

  fetch: async () => {
    const response = await fetch(`http://localhost:8787/api/v1/ai/conversations`, { credentials: "include" });
    const { data } = await response.json();
    set({ conversations: data.conversations ?? [] });
  },
}));
