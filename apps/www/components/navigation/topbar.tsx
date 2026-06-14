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

export function Topbar() {
  const { id } = useParams();
  const router = useRouter();
  const { setMessages } = useChatStore();
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");

  console.log(id);
  

  async function handleDelete() {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8787/api/v1/ai/chat/delete/${id}`,
        {
          method: "DELETE",
        },
      );
      await response.json();
      router.push("/");
      setMessages([]);
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
        `http://localhost:8787/api/v1/ai/chat/share/${id}`,
        {
          method: "POST",
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
    } catch {}
  }

  return (
    <div
      className={cn(
        "fixed z-50 top-0 flex items-center justify-between p-1 text-foreground shadow-sm backdrop-blur-md border-b border-r w-full max-w-[85vw] h-12",
      )}
    >
      <SelectModelPopover />
      {id && (
        <div className="w-fit flex items-center gap-1 shrink-0 ml-10">
          <Dialog>
            <DialogTrigger asChild onClick={handleShareLinkGeneration}>
              <Button
                size={"icon-sm"}
                aria-label="Share conversation"
                className={cn(
                  "rounded-full bg-secondary text-secondary-foreground border border-neutral-700 cursor-pointer",
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
                    Copy
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
                  "rounded-full bg-secondary text-secondary-foreground border border-neutral-700 cursor-pointer",
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
                  className={cn("bg-red-500 text-white")}
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
