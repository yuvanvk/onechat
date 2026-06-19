"use client";

import { useChatStore } from "@/store/useChat";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useMessage(id: string) {
  const { setMessages, pendingMessage } = useChatStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; 
    if (pendingMessage !== null) return;

    const abortController = new AbortController();
    const fetchConversationMessages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8787/api/v1/ai/conversations/${id}`,
          { signal: abortController.signal, credentials: "include" },
        );
        const { data, message } = await response.json();

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
  }, [id]);

  return { isLoading, error };
}
