"use client";

import { toast } from "sonner";
import { ChatInput } from "./chat-input";
import { useParams } from "next/navigation";
import { useChatStore } from "@/store/useChat";
import { useMessage } from "@/hooks/useMessges";
import { Topbar } from "@/components/navigation/topbar";
import { MessageCard } from "@/components/card/message-card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { ChatSkeleton } from "@/components/skeleton/messages-skeleton";
import { useEffect } from "react";
import { useConversationStore } from "@/store/useConversation";

export const Chat = () => {
  const { id } = useParams();
  const { messages, setConversationId } = useChatStore();
  const { fetch } = useConversationStore();
  const { isLoading, error } = useMessage(id as string);

  useEffect(() => {
    if(id) {
      setConversationId(id as string);
      fetch();
    }
  }, [id])
  
  if(error) {
    toast.error(error);
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#080808]">
      <Topbar />
      {id && (
        <ScrollArea className="min-h-[800px] max-h-[900px] max-w-3xl mx-auto w-full px-4 py-5 flex flex-col">
          {isLoading ? (
            <ChatSkeleton />
          ) : (
            <>
              {messages.length > 0 && messages.map((message, idx) => (
                <MessageCard
                  key={idx}
                  content={message.content}
                  role={message.role}
                />
              ))}
            </>
          )}
        </ScrollArea>
      )}
      <ChatInput />
    </div>
  );
};
