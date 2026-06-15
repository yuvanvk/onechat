"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/store/useChat";
import { useParams, useRouter } from "next/navigation";
import { MessageCard } from "@/components/card/message-card";
import { ChatSkeleton } from "@/components/skeleton/messages-skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SharedConversationPage() {
  const router = useRouter();
  const { shareId } = useParams();
  const { messages, setMessages } = useChatStore();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!shareId) return;
    setLoading(true);
    try {
      const fetchShareConversation = async () => {
        const response = await fetch(
          `http://localhost:8787/api/v1/share/${shareId}`,
        );
        const { data } = await response.json();
        setMessages(data.messages);
      };
      fetchShareConversation();
    } catch (error) {
      console.log("SHARE PAGE", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (!shareId) {
    router.push("/");
  }

  return (
    <>
      {shareId && (
        <div className="h-screen  max-w-3xl mx-auto w-full px-4 pt-3 flex flex-col overflow-y-auto">
          {loading ? (
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
        </div>
      )}
    </>
  );
}
