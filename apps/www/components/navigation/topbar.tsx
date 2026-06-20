"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Forward, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/store/useChat";
import { SelectModelPopover } from "../chat/select-model-popover";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { BACKEND_URL } from "@/lib/config";

export function Topbar() {
  const { id } = useParams();
  const router = useRouter();
  const { open, isMobile } = useSidebar();
  const { setMessages, setIsStreaming } = useChatStore();
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");
  const [copied, setCopied] = useState(false);

  async function handleDelete() {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/ai/chat/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      await response.json();
      router.push("/");
      setMessages([]);
      setIsStreaming(false)
    } catch (error) {
      console.log("ERROR in TOPBAR", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleShareLinkGeneration() {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/ai/chat/share/${id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const { data } = await response.json();
      setShareLink(data.shareLink);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleShareLinkCopy() {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div
      className={cn(
        "absolute z-50 top-0 right-0 flex items-center justify-between p-1 text-foreground  backdrop-blur-md w-full border-b max-w-full h-12 bg-background",
      )}
    >
      <div className="flex items-center gap-1">
        {(!open || isMobile) && <SidebarTrigger />}
        <SelectModelPopover />
      </div>
      {id && (
        <div className="w-fit flex items-center gap-1 shrink-0 mr-1">
          <Dialog>
            <DialogTrigger asChild onClick={handleShareLinkGeneration}>
              <Button
                size={"icon-sm"}
                aria-label="Share conversation"
                className={cn(
                  "rounded-lg bg-secondary text-secondary-foreground border-neutral-300 dark:border-neutral-700 cursor-pointer",
                  "hover:text-blue-500 hover:bg-blue-100 hover:border-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-400",
                )}
              >
                <Forward />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share this conversation</DialogTitle>
                <DialogDescription>
                  A shareable link is ready. Copy it and send it to anyone to
                  give them view access.
                </DialogDescription>
              </DialogHeader>

              <Input value={shareLink} disabled />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                {loading ? (
                  <Spinner />
                ) : (
                  <Button variant="outline" onClick={handleShareLinkCopy}>
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size={"icon-sm"}
                aria-label="Delete conversation"
                className={cn(
                  "rounded-lg bg-secondary text-secondary-foreground border border-neutral-300 dark:border-neutral-700 cursor-pointer",
                  "hover:text-rose-500 hover:bg-rose-100 hover:border-rose-400 dark:hover:bg-rose-950 dark:hover:text-rose-400",
                )}
              >
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>
                Are you sure to delete this Conversation?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                Conversation session.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className={cn("bg-red-500 hover:bg-red-600 text-white")}
                >
                  {loading ? <Spinner /> : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
