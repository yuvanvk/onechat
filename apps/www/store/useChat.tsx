import { create } from "zustand";
import {
  Message,
  WebSocketCreateStreamMessage,
  WebSocketGenerateImage,
} from "@workspace/types";

interface ChatStore {
  conversationId: string;
  messages: Message[];
  pendingMessage: WebSocketCreateStreamMessage | WebSocketGenerateImage | null;
  isStreaming: boolean;
  setMessages: (messages: Message[]) => void;
  setPendingMessage: (
    message: WebSocketCreateStreamMessage | WebSocketGenerateImage | null,
  ) => void;
  addMessage: (message: Message) => void;
  updateMessage: (opts: {
    token?: string;
    id?: string;
    setId?: string;
    createdAt?: number;
  }) => void;
  setConversationId: (conversationId: string) => void;
  setRegeneratedMessage: (messageId: string, token: string) => void;
  setMessageEmpty: (messageId: string) => void;
  setImageKey: (imageKey: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversationId: "",
  messages: [],
  isStreaming: false,
  setMessages: (messages) => set({ messages }),
  pendingMessage: null,
  setPendingMessage: (message) => set({ pendingMessage: message }),
  setConversationId: (conversationId) => set({ conversationId }),
  addMessage: (message) => set({ messages: [...get().messages, message] }),
  updateMessage: ({ token, id, setId, createdAt }) =>
    set({
      messages: token
        ? get().messages.map((message) =>
            message.id === "new-ai-message" && message.role === "assistant"
              ? { ...message, content: message.content + token }
              : message,
          )
        : id && setId
          ? get().messages.map((msg) =>
              msg.id === id ? { ...msg, id: setId, createdAt} : msg,
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
  setImageKey: (imageKey: string) =>
    set({
      messages: get().messages.map((message) =>
        message.id === "new-ai-message" ? { ...message, imageKey } : message,
      ),
    }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
}));
