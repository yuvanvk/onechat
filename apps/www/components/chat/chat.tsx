"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import { ChatInput } from "./chat-input";
import { useParams } from "next/navigation";
import { useChatStore } from "@/store/useChat";
import { useMessage } from "@/hooks/useMessges";
import { Topbar } from "@/components/navigation/topbar";
import { MessageCard } from "@/components/card/message-card";
import { useConversationStore } from "@/store/useConversation";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { ChatSkeleton } from "@/components/skeleton/messages-skeleton";

export const Chat = () => {
  const { id } = useParams();
  const { messages, setConversationId } = useChatStore();
  const { fetch } = useConversationStore();
  const { isLoading, error } = useMessage(id as string);

  useEffect(() => {
    if (id) {
      setConversationId(id as string);
    }
    fetch();
  }, [id]);

  if (error) {
    toast.error(error);
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#080808] h-full">
      <Topbar />
      {id && (
        <ScrollArea className="min-h-242.5 max-h-242.5 max-w-3xl mx-auto w-full px-4 pt-3 pb-27.5 h-full flex flex-col">
          {isLoading ? (
            <ChatSkeleton />
          ) : (
            <>
              {messages.length > 0 &&
                messages.map((message, idx) => (
                  <MessageCard
                    id={message.id}
                    key={idx}
                    messageType={message.messageType ?? (message as any).message_type}
                    content={message.content}
                    role={message.role}
                    pdfs={message.pdfs}
                    imageKey={message.imageKey ?? (message as any).image_key}
                    images={
                      typeof message.images === "string"
                        ? JSON.parse(
                            message.images as unknown as string,
                          ).filter(Boolean)
                        : message.images
                    }
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
