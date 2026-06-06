import { create } from "zustand";
import { Message, WebSocketCreateStreamMessage } from "@workspace/types";

interface ChatStore {
  conversationId: string;
  messages: Message[];
  pendingMessage: WebSocketCreateStreamMessage | null;
  setMessages: (messages: Message[]) => void;
  setPendingMessage: (message: WebSocketCreateStreamMessage | null) => void;
  addMessage: (message: Message) => void;
  updateMessage: (opts: {
    token?: string;
    id?: string;
    setId?: string;
  }) => void;
  setConversationId: (conversationId: string) => void;
  setRegeneratedMessage: (messageId: string, token: string) => void;
  setMessageEmpty: (messageId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversationId: "",
  messages: [],
  setMessages: (messages) => set({ messages }),
  pendingMessage: null,
  setPendingMessage: (message) => set({ pendingMessage: message }),
  setConversationId: (conversationId) => set({ conversationId }),
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
  setRegeneratedMessage: (messageId, token) =>
    set({
      messages: get().messages.map((message) =>
        message.role === "assistant" && message.id === messageId
          ? { ...message, content: message.content + token }
          : message,
      ),
    }),

  setMessageEmpty: (messageId) =>
    set({
      messages: get().messages.map((message) =>
        message.id === messageId ? { ...message, content: "" } : message,
      ),
    }),
}));
