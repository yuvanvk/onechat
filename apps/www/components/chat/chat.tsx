"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import { ChatInput } from "./chat-input";
import { useParams, useRouter } from "next/navigation";
import { useChatStore } from "@/store/useChat";
import { useMessage } from "@/hooks/useMessges";
import { Topbar } from "@/components/navigation/topbar";
import { MessageCard } from "@/components/card/message-card";
import { useConversationStore } from "@/store/useConversation";
import { ChatSkeleton } from "@/components/skeleton/messages-skeleton";
import { Banner } from "../card/banner";
import { authClient } from "@/lib/better-auth/auth-client";

export const Chat = () => {
  const { id } = useParams();
  const { messages, setConversationId } = useChatStore();
  const { fetch } = useConversationStore();
  const router = useRouter();
  const { isLoading, error } = useMessage(id as string);

  const { data } = authClient.useSession();

  useEffect(() => {
    if (id) {
      setConversationId(id as string);
    }
    fetch();
  }, [id, setConversationId, fetch]);

  useEffect(() => {
    if (data?.session) {
      router.push("/")
    }
  }, [data?.session])

  if (error) {
    toast.error(error);
  }


  return (
    <div className="flex flex-col bg-background h-full w-full">
      <Topbar />
      <Banner bannerText="Credits too low. Please topup credits in order to continue chat." />
      {!id && (
        <div className="flex items-center justify-center h-screen">
          {/* hi */}
        </div>
      )}
      {id && (
        <div className="min-h-242.5 max-h-242.5 max-w-3xl mx-auto w-full px-4 pt-14 pb-21 h-full flex flex-col overflow-y-auto">
          {isLoading ? (
            <ChatSkeleton />
          ) : (
            <>
              {messages.length > 0 &&
                messages.map((message, idx) => (
                  <MessageCard
                    id={message.id}
                    key={idx}
                    messageType={
                      message.messageType ?? (message as any).message_type
                    }
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
        </div>
      )}
      <ChatInput />
    </div>
  );
};
