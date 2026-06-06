"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { Message, WebSocketClientMessage, WebSocketRegenerateStreamMessage } from "@workspace/types";
import ReactMarkdown from "react-markdown";
import { Copy, RotateCcw } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { useSocket } from "@/hooks/useSocket";
import { useParams } from "next/navigation";
import { useChatStore } from "@/store/useChat";

const PROSE_CLASSES = `
  prose prose-invert prose-neutral max-w-none
  prose-p:text-[15px] prose-p:leading-7 prose-p:text-neutral-100
  prose-headings:text-neutral-100 prose-headings:font-medium
  prose-strong:text-neutral-100
  prose-code:text-neutral-200 prose-code:px-1 prose-code:py-0.5
  prose-code:rounded prose-code:text-[13px]
  prose-code:before:content-none prose-code:after:content-none
  prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800
  prose-li:text-neutral-100 prose-li:text-[15px]
  prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
  prose-blockquote:border-neutral-700 prose-blockquote:text-neutral-400
  prose-hr:border-neutral-800
`.trim();

const getImageUrl = (key: string) =>
  `http://localhost:8787/api/v1/r2/images/${key}`;

function ThinkingIndicator() {
  return (
    <motion.span
      className="bg-linear-to-r from-zinc-500 via-zinc-100 to-zinc-500 bg-clip-text text-transparent text-[13px] flex items-center gap-1"
      style={{ backgroundSize: "200% 100%" }}
      animate={{ backgroundPositionX: ["0%", "200%"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    >
      <img src="/logo.svg" className="w-4 h-4" />
      Thinking…
    </motion.span>
  );
}

function MessageActions({
  onCopy,
  showRegenerate,
  onRegenerate
}: {
  onCopy: () => void;
  onRegenerate?: () => Promise<void>;
  showRegenerate?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button size="icon-xs" variant="ghost" onClick={onCopy}>
        <Copy />
      </Button>
      {showRegenerate && (
        <Button size="icon-xs" variant="ghost" onClick={onRegenerate}>
          <RotateCcw />
        </Button>
      )}
    </div>
  );
}

export function MessageCard({ id, content, role, images, pdfs, model="@cf/moonshotai/kimi-k2.6" }: Message) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { conversationId, setMessageEmpty } = useChatStore();
  const { send } = useSocket(conversationId as string);

  const isUser = role === "user";

  async function handleCopy() {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }

  async function handleRegenerate() {
    console.log("inside re-gen");
    setMessageEmpty(id!);
    const regenerateMessage: WebSocketRegenerateStreamMessage = {
      type: "chat.stream.regenerate",
      messageId: id as string,
      content,
      conversationId,
      model,
    }
    send(regenerateMessage);
    console.log("processed");
    
  }

  return (
    <div className="mb-10 flex flex-col gap-2">
      {/* Image attachments */}
      {isUser && images && images.length > 0 && (
        <div className="flex items-center gap-2 justify-end flex-wrap">
          {images.map((image) => {
            return (
              <div key={image.name}>
                <Image
                  src={getImageUrl(image.name)}
                  alt={image.name}
                  width={150}
                  height={150}
                  priority
                  unoptimized
                  onClick={() => setPreviewImage(getImageUrl(image.name))}
                  className="object-cover rounded-lg cursor-pointer"
                />
                {previewImage && (
                  <div
                    onClick={() => setPreviewImage(null)}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
                  >
                    <img
                      src={previewImage}
                      alt="preview"
                      className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Message bubble */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "text-neutral-100 text-[15px]",
          isUser
            ? content && "w-fit max-w-xs px-2 py-1.5 bg-neutral-800 rounded-xl ml-auto"
            : "max-w-2xl w-full p-1.5 mr-auto",
        )}
      >
        {isUser && <div>{content}</div>}

        {!isUser && (
          <>
            {!content && <ThinkingIndicator />}
            {content && (
              <div className={PROSE_CLASSES}>
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Actions */}
      {isUser && content && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="flex justify-end"
        >
          <MessageActions onCopy={handleCopy} />
        </motion.div>
      )}

      {!isUser && content && (
        <MessageActions onCopy={handleCopy} onRegenerate={handleRegenerate} showRegenerate />
      )}
    </div>
  );
}
