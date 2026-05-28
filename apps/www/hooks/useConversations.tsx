"use client";

import { Conversation } from "@workspace/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useConversations(): Conversation[] {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchUserConversations = async () => {
      const response = await fetch(`http://localhost:8787/api/v1/ai/conversations`);
      
      const { message, data } = await response.json();
      if(response.status !== 200) {
        toast.error(message)
      } 
      setConversations(data.conversations);
    };
    fetchUserConversations()
  }, []);

  return conversations;
}
