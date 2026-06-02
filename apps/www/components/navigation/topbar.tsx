"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Forward, Trash2 } from "lucide-react";
import { Spinner } from "@workspace/ui/components/spinner";
import { Button } from "@workspace/ui/components/button";
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
import { useParams, useRouter } from "next/navigation";

export function Topbar() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if(!id) return;
    setLoading(true)
    console.log(id);
    try {
      const response = await fetch(`http://localhost:8787/api/v1/ai/chat/delete/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      alert(data.message)

      router.push("/");
    } catch (error) {
        console.log("ERROR in TOPBAR", error);
    } finally {
      setLoading(false)
    }
  }
  return (
    <div
      className={cn(
        "fixed top-3 right-2 p-1 rounded-2xl",
        "flex items-center gap-1",
      )}
    >
      <Button
        size={"icon-sm"}
        className={cn(
          "rounded-full bg-[#2d2d2c] text-neutral-300 border-neutral-700",
          "hover:text-blue-500 hover:bg-blue-100 hover:border-blue-400",
        )}
      >
        <Forward />
      </Button>

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
