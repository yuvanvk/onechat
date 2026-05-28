"use client"
import { Skeleton } from "@workspace/ui/components/skeleton";

export const MessageSkeleton = [
    {
        id: "user"
    },
    {
        id: "assistant"
    },
    {
        id: "user"
    },
    {
        id: "assistant"
    },
]

function UserMessageSkeleton() {
    return (
      <div className="flex justify-end">
        <div className="flex flex-col items-end gap-2 max-w-[60%]">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }
  
  function AssistantMessageSkeleton() {
    return (
      <div className="flex justify-start">
        <div className="flex flex-col gap-2 max-w-[75%]">
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    );
  }
  
  export function ChatSkeleton() {
    return (
      <div className="flex flex-col gap-6 p-4">
        {MessageSkeleton.map((message, index) =>
          message.id === "user" ? (
            <UserMessageSkeleton key={index} />
          ) : (
            <AssistantMessageSkeleton key={index} />
          )
        )}
      </div>
    );
  }
