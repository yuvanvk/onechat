"use client";

import { motion } from "motion/react";
import { Message } from "@workspace/types";
import ReactMarkdown from "react-markdown";
import { cn } from "@workspace/ui/lib/utils";

export function MessageCard({ id, content, role }: Message) {
  const isUser = role === "user";
  const isAssistant = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className={cn(
        isUser &&
        "w-fit max-w-xs ml-auto px-2 py-1.5 bg-neutral-800 rounded-xl",
        isAssistant && "max-w-2xl w-full mr-auto p-1.5",
        "mb-3 text-neutral-100 text-[15px]",
      )}
    >
      {isUser && content}
      {isAssistant && (
        <div>
          {!content && (
            <motion.span
              className="bg-linear-to-r from-zinc-500 via-zinc-100 to-zinc-500 bg-clip-text text-transparent text-[13px] flex items-center gap-1"
              style={{
                backgroundSize: "200% 100%",
              }}
              animate={{
                backgroundPositionX: ["0%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <img src={"/logo.svg"} className="w-4 h-4" />
              Thinking…
            </motion.span>
          )}
          {content &&
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          }
        </div>
      )}
    </motion.div>
  );
}
