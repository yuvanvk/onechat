"use client";

import { useChatStore } from "@/store/useChat";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useMessage(conversationId: string) {
  const { setMessages } = useChatStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) return;
    const abortController = new AbortController();

    const fetchConversationMessages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8787/api/v1/ai/conversations/${conversationId}`,
          { signal: abortController.signal },
        );
        const { data, message } = await response.json();
        
        toast(message);
        setMessages(data.messages ?? []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setError((error as Error).message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversationMessages();

    return () => abortController.abort();
  }, [conversationId]);

  return { isLoading, error };
}
