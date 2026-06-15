"use client";

import Image from "next/image";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useSocket } from "@/hooks/useSocket";
import { Copy, RotateCcw, Download } from "lucide-react";
import { useChatStore } from "@/store/useChat";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Message, WebSocketRegenerateStreamMessage } from "@workspace/types";

const PROSE_CLASSES = `
  prose prose-neutral dark:prose-invert max-w-none
  prose-p:text-[15px] prose-p:leading-7 prose-p:text-foreground
  prose-headings:text-foreground prose-headings:font-medium
  prose-strong:text-foreground
  prose-code:text-foreground prose-code:px-1 prose-code:py-0.5
  prose-code:rounded prose-code:text-[13px]
  prose-code:before:content-none prose-code:after:content-none
  prose-pre:bg-muted prose-pre:border prose-pre:border-border
  prose-li:text-foreground prose-li:text-[15px]
  prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
  prose-blockquote:border-border prose-blockquote:text-muted-foreground
  prose-hr:border-border
`.trim();

const getImageUrl = (key: string) =>
  `http://localhost:8787/api/v1/r2/images/${key}`;

function ThinkingIndicator({ loaderText = "Thinking..."}: { loaderText?: string }) {
  return (
    <motion.span
      className="bg-linear-to-r from-muted-foreground via-foreground to-muted-foreground bg-clip-text text-transparent text-[13px] flex items-center gap-1"
      style={{ backgroundSize: "200% 100%" }}
      animate={{ backgroundPositionX: ["0%", "200%"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    >
      <img src="/logo.svg" className="w-4 h-4" />
      {loaderText}
    </motion.span>
  );
}

function MessageActions({
  onCopy,
  onDownload,
  showRegenerate,
  onRegenerate,
}: {
  onCopy?: () => void;
  onDownload?: () => Promise<void>;
  onRegenerate?: () => Promise<void>;
  showRegenerate?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      {onCopy && (
        <Button size="icon-xs" variant="ghost" onClick={onCopy}>
          <Copy />
        </Button>
      )}
      {onDownload && (
        <Button size="icon-sm" variant="ghost" onClick={onDownload}>
          <Download />
        </Button>
      )}
      {showRegenerate && onRegenerate && (
        <Button size="icon-xs" variant="ghost" onClick={onRegenerate}>
          <RotateCcw />
        </Button>
      )}
    </div>
  );
}

export function MessageCard({
  id,
  messageType,
  content,
  role,
  imageKey,
  images,
  pdfs,
  model = "@cf/moonshotai/kimi-k2.6",
}: Message) {
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
    if (!content) return;
    setMessageEmpty(id!);
    const regenerateMessage: WebSocketRegenerateStreamMessage = {
      type: "chat.stream.regenerate",
      messageId: id as string,
      content,
      conversationId,
      model,
    };
    send(regenerateMessage);
    console.log("processed");
  }

  async function handleDownload() {
    if (!imageKey) return;

    try {
      const response = await window.fetch(getImageUrl(encodeURIComponent(imageKey)));
      if (!response.ok) {
        throw new Error("Failed to download image");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${imageKey}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Image download failed:", error);
    }
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
                <AnimatePresence>
                  {previewImage && (
                    <motion.div
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(10px)" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      onClick={() => setPreviewImage(null)}
                      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
                    >
                      <img
                        src={previewImage}
                        alt="preview"
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
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
          "text-foreground text-[15px]",
          isUser
            ? content &&
                "w-fit max-w-xs px-2 py-1.5 bg-muted rounded-xl ml-auto"
            : "max-w-2xl w-full p-1.5 mr-auto",
        )}
      >
        {isUser && <div>{content}</div>}

        {!isUser && (
          messageType === "text" ? (
            !content ? (
              <ThinkingIndicator />
            ) : (
              <div className={PROSE_CLASSES}>
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )
          ) : (
            !imageKey ? (
              <ThinkingIndicator loaderText="Generating Image..." />
            ) : (
              <Image
                src={getImageUrl(encodeURIComponent(imageKey))}
                alt={imageKey}
                width={400}
                height={400}
                className="rounded-lg object-cover"
              />
            )
          )
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

      {!isUser && messageType === "text" && content && (
        <MessageActions
          onCopy={handleCopy}
          onRegenerate={handleRegenerate}
          showRegenerate
        />
      )}

      {!isUser && messageType !== "text" && imageKey && (
        <MessageActions
          onDownload={handleDownload}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
}
