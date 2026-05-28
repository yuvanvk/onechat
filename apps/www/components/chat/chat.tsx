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

export const Chat = () => {
  const { messages } = useChatStore();
  const { id } = useParams();
  const { isLoading, error } = useMessage(id as string);

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
