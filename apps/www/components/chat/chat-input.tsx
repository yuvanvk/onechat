"use client";

import { toast } from "sonner";
import { motion } from "motion/react";
import {
  Role,
  WebSocketCreateStreamMessage,
} from "@workspace/types";
import { Paperclip } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useChatStore } from "@/store/useChat";
import { AttachmentChip } from "./attachment-chip";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { SelectModelPopover } from "./select-model-popover";
import { Attachment, processFiles } from "@/utils/process-file";
import { useSocket } from "@/hooks/useSocket";
import { useParams, useRouter } from "next/navigation";

export const ChatInput = () => {
  const { id } = useParams();
  const router = useRouter();

  const { addMessage, pendingMessage, conversationId, setConversationId, setPendingMessage } = useChatStore();

  const [input, setInput] = useState<string>("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { send } = useSocket(conversationId as string);
  const hasInput = input.length > 0;

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    processFiles(
      Array.from(e.target.files),
      (a) => setAttachments((p) => [...p, a]),
      (msg) => toast.error(msg),
    );
    e.target.value = "";
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const items = Array.from(e.clipboardData.items);

    const images = items
      .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter(Boolean) as File[];

    if (images.length === 0) return;

    e.preventDefault();
    processFiles(
      images,
      (a) => setAttachments((p) => [...p, a]),
      (msg) => toast.error(msg),
    );
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    setIsDraggingOver(true);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  function handleDragLeave(e: React.DragEvent) {
    if (dropZoneRef.current?.contains(e.relatedTarget as Node)) return;
    setIsDraggingOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDraggingOver(false);
    processFiles(
      Array.from(e.dataTransfer.files),
      (a) => setAttachments((p) => [...p, a]),
      (msg) => toast.error(msg),
    );
  }

  function removeFile(id: string) {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id == id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((a) => a.id != id);
    });
  }

  useEffect(() => {
    if(!pendingMessage || !id) return;
    const messageToSend = pendingMessage;
    try {
      send(messageToSend);
      setPendingMessage(null)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } 
  }, [pendingMessage, id, send]);

  async function handleAIResponse() {
    
    const content = input
    setInput("");
    let activeId = id as string;

    if (!activeId) {
      const response = await fetch("http://localhost:8787/api/v1/ai/create", {
        method: "POST",
      });
      const { data } = await response.json();
      activeId = data.conversationId;
      setConversationId(activeId);
      setPendingMessage({
        type: "chat.stream.create",
        eventId: crypto.randomUUID(),
        role: Role.User,
        content,
        conversationId: activeId,
        model: "@cf/moonshotai/kimi-k2.6"
      })
      addMessage({
        id: "new-user-message",
        role: "user" as Role,
        content,
      });
      addMessage({
        id: "new-ai-message",
        role: "assistant" as Role,
        content: "",
      });
      router.push(`/c/${activeId}`);
      return;
    }
    addMessage({
      id: "new-user-message",
      role: "user" as Role,
      content: content,
    });

    addMessage({
      id: "new-ai-message",
      role: "assistant" as Role,
      content: "",
    });

    try {
      const createMessage: WebSocketCreateStreamMessage = {
        type: "chat.stream.create",
        eventId: crypto.randomUUID(),
        role: Role.User,
        content,
        conversationId: activeId,
        model: "@cf/moonshotai/kimi-k2.6",
      };
      send(createMessage);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
    }
  }

  return (
    <motion.div
      layout
      ref={dropZoneRef}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col rounded-3xl border border-[#191919] dark:bg-[#121212] max-w-3xl w-full mx-auto px-3.5 py-3.5 gap-2 fixed",
        id && "bottom-3 left-1/2 -translate-x-1/2",
        !id && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        isDraggingOver && "drag-active",
      )}
    >
      {attachments.length > 0 && (
        <div className="flex items-center gap-4 mb-3">
          {attachments.map((attachment) => (
            <AttachmentChip
              file={attachment}
              key={attachment.id}
              onRemove={() => removeFile(attachment.id)}
            />
          ))}
        </div>
      )}
      <Textarea
        rows={1}
        value={input}
        onPaste={handlePaste}
        placeholder="Ask anything..."
        onChange={handleChange}
        className={cn(
          "bg-transparent! border-none focus:ring-0! px-1 text-[15px]! resize-none! min-h-0! rounded-none ml-2",
        )}
      />

      <div className={cn("flex items-center justify-between")}>
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            size={"sm"}
            variant={"ghost"}
            aria-label="Attach file"
            className="text-neutral-400"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip />
          </Button>
        </>

        <div className={cn("flex items-center gap-1.5")}>
          {/* Select Models */}
          <SelectModelPopover />

          <Button
            size={"icon"}
            disabled={!hasInput}
            onClick={handleAIResponse}
            className={cn(" rounded-full")}
          >
            <motion.div
              animate={{ rotate: input ? "-90deg" : "0deg" }}
              transition={{
                type: "spring",
                damping: 13,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-right"
                aria-hidden="true"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </motion.div>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};