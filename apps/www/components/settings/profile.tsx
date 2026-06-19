"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Profile = () => {
  const router = useRouter();
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);
  const [editedName, setEditedName] = useState("");

  async function handleSave () {
    if(!editedName) {
      toast.error("Invalid Username")
      return
    }
    const response = await fetch("http://localhost:8787/api/v1/settings/update/user", {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({
        name: editedName
      })
    });
    if(!response.ok) {
      toast.error("Failed to change username")
      return
    }
    const { message } = await response.json();
    toast.success(message)
  }

  return (
    <div className="max-w-3xl mx-auto w-full py-12 flex flex-col">
      <div className="flex items-center gap-2">
        <Button 
          size={"icon-lg"} 
          variant={"ghost"}
          onClick={() => router.back()}
        >
          <ArrowLeft />
        </Button>
        <h1 className="font-medium text-2xl tracking-tight">Profile</h1>
      </div>

      <div className="flex flex-col mt-10 gap-8">
        <div className="space-y-3">
          <Label className="text-muted-foreground">Username</Label>
          <div className="flex items-center gap-2">
            <Input placeholder="Yuvan" disabled={!isEditingUsername} value={editedName} onChange={(e) => setEditedName(e.target.value)} />
            <Button
              className="cursor-pointer"
              onClick={() => setIsEditingUsername(true)}
            >
              <Edit />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-muted-foreground">Email</Label>
          <Input placeholder="yuvan@gmail.com" disabled />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant={"destructive"}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};
