"use client";

import { useCallback, useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChat";
import {
  WebSocketClientMessage,
  WebSocketServerMessage,
} from "@workspace/types";
import { useConversationStore } from "@/store/useConversation";
import { toast } from "sonner";
import { WS_URL } from "@/lib/config";

export function useSocket(conversationId: string) {
  const ws = useRef<WebSocket | null>(null);
  const { updateMessage, setRegeneratedMessage, setImageKey, setIsStreaming } = useChatStore();
  const { setTitle } = useConversationStore();

  useEffect(() => {
    if (!conversationId) return;

    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const socket = new WebSocket(`${WS_URL}/api/v1/ai/chat?conversationId=${conversationId}`);
    ws.current = socket;

    socket.onmessage = (event: MessageEvent) => {
      const parsed = JSON.parse(event.data) as WebSocketServerMessage;
      switch (parsed.type) {
        case "chat.stream.response":
          updateMessage({ token: parsed.content });
          break;
        case "chat.regenerate.response":
          setRegeneratedMessage(parsed.messageId, parsed.content);
          break;
        case "chat.title.generated":
          setTitle(parsed.title, parsed.conversationId);
          break;
        case "chat.stream.done":
          setIsStreaming(false)
          updateMessage({ id: "new-user-message", setId: parsed.userMessageId, createdAt: parsed.userMessageCreatedAt });
          updateMessage({ id: "new-ai-message", setId: parsed.aiMessageId, createdAt: parsed.aiMessageCreatedAt });
          break;
        case "chat.stream.error":
          toast.error(parsed.message);
          setIsStreaming(false)
          break;
        case "chat.generated.image":
          setIsStreaming(false)
          setImageKey(parsed.imageKey);
          updateMessage({ id: "new-user-message", setId: parsed.userMessageId, createdAt: parsed.userMessageCreatedAt });
          updateMessage({ id: "new-ai-message", setId: parsed.id, createdAt: parsed.aiMessageCreatedAt });
          break;
        case "chat.regenerate.done":
          setIsStreaming(false);
          break;
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [conversationId]);

  const send = useCallback((message: WebSocketClientMessage) => {
    const socket = ws.current;
    if (!socket) return;

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else if (socket.readyState === WebSocket.CONNECTING) {
      socket.addEventListener("open", () => {
        socket.send(JSON.stringify(message));
      },
        { once: true },
      );
    }
  }, []);

  return { ws, send };
}