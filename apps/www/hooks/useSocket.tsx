"use client";

import { useCallback, useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChat";
import {
  WebSocketClientMessage,
  WebSocketServerMessage,
} from "@workspace/types";
import { useConversationStore } from "@/store/useConversation";

export function useSocket(conversationId: string) {
  const ws = useRef<WebSocket | null>(null);
  const { updateMessage } = useChatStore();
  const { setTitle } = useConversationStore();

  useEffect(() => {
    if (!conversationId) return;

    const socket = new WebSocket(
      `ws://localhost:8787/api/v1/ai/chat?conversationId=${conversationId}`,
    );
    ws.current = socket;

    socket.onmessage = (event: MessageEvent) => {
      const parsed = JSON.parse(event.data) as WebSocketServerMessage;
      switch (parsed.type) {
        case "chat.stream.response":
          updateMessage({ token: parsed.content });
          break;
        case "chat.title.generated":
          setTitle(parsed.title, parsed.conversationId);
          break;
        case "chat.stream.done":
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