"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Forward, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Spinner } from "@workspace/ui/components/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { useChatStore } from "@/store/useChat";

export function Topbar() {
  const { id } = useParams();
  const router = useRouter();
  const { setMessages } = useChatStore();
  const [loading, setLoading] = useState(false);
  const [shareLink, setshareLink] = useState<string>("");

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
      const data = await response.json();
      router.push("/");
      setMessages([]);
    } catch (error) {
      console.log("ERROR in TOPBAR", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleShareLinkGeneration() {
    if(!id) return;
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8787/api/v1/ai/chat/share/${id}`, {
        method: "POST",
      })
      const { message, data } = await response.json();
      setshareLink(data.shareLink)
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  }

  async function handleShareLinkCopy() {
    if(!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch (error) {
    }
  }

  return (
    <div
      className={cn(
        "fixed top-3 right-2 p-1 rounded-2xl",
        "flex items-center gap-1",
      )}
    >
      <Dialog>
        <DialogTrigger asChild onClick={handleShareLinkGeneration}>
          <Button
            size={"icon-sm"}
            className={cn(
              "rounded-full bg-[#2d2d2c] text-neutral-300 border-neutral-700",
              "hover:text-blue-500 hover:bg-blue-100 hover:border-blue-400",
            )}
          >
            <Forward />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this conversation</DialogTitle>
            <DialogDescription>
              A shareable link is ready. Copy it and send it to anyone to give
              them view access.
            </DialogDescription>
          </DialogHeader>

          <Input value={shareLink} disabled />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {loading ? <Spinner /> : <Button variant="outline" onClick={handleShareLinkCopy}>Copy</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size={"icon-sm"}
            className={cn(
              "rounded-full bg-[#2d2d2c] text-neutral-300  border-neutral-700",
              "hover:text-rose-500 hover:bg-rose-100 hover:border-rose-400",
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
  );
}
