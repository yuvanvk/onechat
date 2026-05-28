import { create } from "zustand";
import { Message } from "@workspace/types";

interface MessageStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (opts: {
    token?: string;
    id?: string;
    setId?: string;
  }) => void;
}

export const useChatStore = create<MessageStore>((set, get) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set({ messages: [...get().messages, message] }),
  updateMessage: ({ token, id, setId }) =>
    set({
      messages: token
        ? get().messages.map((message) =>
            message.id === "new-ai-message" && message.role === "assistant"
              ? { ...message, content: message.content + token }
              : message,
          )
        : id && setId
          ? get().messages.map((msg) =>
              msg.id === id ? { ...msg, id: setId } : msg,
            )
          : get().messages,
    }),
}));

