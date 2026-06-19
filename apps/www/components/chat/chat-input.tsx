"use client";

import { toast } from "sonner";
import { motion } from "motion/react";
import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocket } from "@/hooks/useSocket";
import { useChatStore } from "@/store/useChat";
import { AttachmentChip } from "./attachment-chip";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SelectModelPopover } from "./select-model-popover";
import { Attachment, processFiles } from "@/utils/process-file";
import { uploadToBucket } from "@/utils/upload-to-bucket";
import {
  Role,
  WebSocketCreateStreamMessage,
  WebSocketGenerateImage,
} from "@workspace/types";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useModel } from "@/store/useModel";
import { isModelImageGen } from "@/lib/helper/is-model-image-gen";

export const ChatInput = () => {
  const { id } = useParams();
  const router = useRouter();
  const { modelId } = useModel();

  const {
    addMessage,
    pendingMessage,
    conversationId,
    setConversationId,
    setPendingMessage,
  } = useChatStore();

  const [input, setInput] = useState<string>("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { send } = useSocket(conversationId as string);

  const hasInput = useMemo(
    () => input.length > 0 || attachments.length > 0,
    [input, attachments],
  );
  const objects = useMemo(
    () =>
      attachments.map((a) => ({ name: a.name, type: a.type, size: a.size })),
    [attachments],
  );

  const fileMapRef = useRef<Record<string, File>>({});

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  function handleAdd(attachment: Attachment, File: File) {
    setAttachments((p) => [...p, attachment]);
    fileMapRef.current[attachment.name] = File;
  }

  function handleUpdate(fileName: string, patch: Partial<Attachment>) {
    setAttachments((p) =>
      p.map((x) => (x.name === fileName ? { ...x, ...patch } : x)),
    );
  }

  function removeFile(fileName: string) {
    setAttachments((prev) => {
      const target = prev.find((a) => a.name == fileName);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((a) => a.name != fileName);

      // also send a request to delete the file from the bucket if needed
    });
  }

  async function handleReUploadFile(fileName: string): Promise<void> {
    const file = fileMapRef.current[fileName];
    if (!file) {
      toast.error("File not found");
      return;
    }
    handleUpdate(file.name, { status: "uploading" });
    try {
      await uploadToBucket(file);
      handleUpdate(file.name, { status: "success" });
    } catch (error) {
      handleUpdate(file.name, { status: "error" });
      toast.error("Failed to Upload file.");
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    processFiles(Array.from(e.target.files), handleAdd, handleUpdate, (msg) =>
      toast.error(msg),
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
      (fileName, patch) =>
        setAttachments((p) =>
          p.map((x) => (x.name === fileName ? { ...x, ...patch } : x)),
        ),
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
      (fileName, patch) =>
        setAttachments((p) =>
          p.map((x) => (x.name === fileName ? { ...x, ...patch } : x)),
        ),
      (msg) => toast.error(msg),
    );
  }

  useEffect(() => {
    if (!pendingMessage || !id) return;
    const messageToSend = pendingMessage;
    try {
      send(messageToSend);
      setPendingMessage(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }, [pendingMessage, id, send]);

  async function handleAIResponse() {
    const content = input;
    setInput("");
    setAttachments([]);

    let activeId = id as string;

    if (!activeId) {
      const response = await fetch("http://localhost:8787/api/v1/ai/create", {
        method: "POST",
        credentials: "include",
      });

      const { data } = await response.json();
      activeId = data.conversationId;
      setConversationId(activeId);

      if (isModelImageGen(modelId)) {
        setPendingMessage({
          type: "chat.generate.image",
          role: Role.User,
          content,
          conversationId: activeId,
          model: "@cf/black-forest-labs/flux-1-schnell",
        });
        addMessage({
          id: "new-user-message",
          role: "user" as Role,
          content,
          messageType: "text",
          // images: attachments
          //   .filter((a) => a.type.startsWith("image/"))
          //   .map((a) => ({ name: a.name, size: a.size, type: a.type })),
        });
        addMessage({
          id: "new-ai-message",
          role: "assistant" as Role,
          messageType: "image",
        });
      } else {
        setPendingMessage({
          type: "chat.stream.create",
          role: Role.User,
          content,
          conversationId: activeId,
          objects,
          model: modelId,
        });
        addMessage({
          id: "new-user-message",
          role: "user" as Role,
          content,
          messageType: "text",
          images: attachments
            .filter((a) => a.type.startsWith("image/"))
            .map((a) => ({ name: a.name, size: a.size, type: a.type })),
        });
        addMessage({
          id: "new-ai-message",
          role: "assistant" as Role,
          content: "",
          messageType: "text",
        });
      }
      router.push(`/c/${activeId}`);
      return;
    }
    if (isModelImageGen(modelId)) {
      addMessage({
        id: "new-user-message",
        role: "user" as Role,
        content: content,
        messageType: "text",
        // images: attachments
        //   .filter((a) => a.type.startsWith("image/"))
        //   .map((a) => ({ name: a.name, size: a.size, type: a.type })),
      });

      addMessage({
        id: "new-ai-message",
        role: "assistant" as Role,
        messageType: "image",
      });
    } else {
      addMessage({
        id: "new-user-message",
        role: "user" as Role,
        content,
        messageType: "text",
        images: attachments
          .filter((a) => a.type.startsWith("image/"))
          .map((a) => ({ name: a.name, size: a.size, type: a.type })),
      });
      addMessage({
        id: "new-ai-message",
        role: "assistant" as Role,
        content: "",
        messageType: "text",
      });
    }

    try {
      let createMessage: WebSocketCreateStreamMessage | WebSocketGenerateImage;
      if (isModelImageGen(modelId)) {
        createMessage = {
          type: "chat.generate.image",
          role: Role.User,
          content,
          conversationId: activeId,
          model: modelId,
        };
      } else {
        createMessage = {
          type: "chat.stream.create",
          role: Role.User,
          content,
          conversationId: activeId,
          model: modelId,
        };
      }
      console.log(createMessage);
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
      ref={dropZoneRef}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col rounded-xl border border-neutral-300 dark:border-accent bg-white dark:bg-[#121212] max-w-3xl w-full mx-auto p-1 gap-2 absolute",
        "bottom-2 left-1/2 -translate-x-1/2",
        isDraggingOver && "drag-active",
      )}
    >
      {attachments.length > 0 && (
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          {attachments.map((attachment) => (
            <AttachmentChip
              key={attachment.id}
              file={attachment}
              // originalFile={fileMapRef.current[attachment.name]}
              handleReUploadFile={handleReUploadFile}
              onRemove={() => removeFile(attachment.name)}
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
          "bg-transparent! border-none focus:ring-0! text-[14px]! resize-none! min-h-0! rounded-none",
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
            className="text-muted-foreground"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip />
          </Button>
        </>

        <div className={cn("flex items-center gap-1.5 pb-1 px-1")}>
          <Button
            size={"icon-sm"}
            disabled={!hasInput}
            onClick={handleAIResponse}
            className={cn(" rounded-lg")}
          >
            <motion.div
              animate={{ rotate: hasInput ? "-90deg" : "0deg" }}
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
