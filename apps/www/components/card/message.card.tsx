"use client";

import { motion } from "motion/react";
import { Message } from "@workspace/types";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

export function MessageCard({ id, content, role }: Message) {
  const isUser = role === "user";
  const isAssistant = role === "assistant";
  const isLatestAiMessage = id === "new-ai-message"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className={cn(
        isUser && "w-fit max-w-xs ml-auto px-2 py-1.5 bg-neutral-800 rounded-xl",
        isAssistant && "max-w-2xl w-full mr-auto p-1.5",
        "my-2 text-neutral-100 text-[15px]",
      )}
    >
      {isUser && content}
      {isAssistant && <span>
        AI
        {content}
      </span>}
    </motion.div>
  );
}
