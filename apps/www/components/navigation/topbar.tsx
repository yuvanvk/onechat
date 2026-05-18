"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Cog, Command, Ghost } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export function Topbar() {
  return (
    <div
      className={cn(
        "fixed top-4 right-4 bg-linear-to-b bg-[#161616] border border-[#1d1d1d] p-1 rounded-xl",
        "flex items-center gap-1",
      )}
    >
      <Button
        size={"icon"}
        className={cn("bg-neutral-800 text-neutral-200 rounded-full")}
      >
        <Command />
      </Button>

      <Button
        size={"icon"}
        className={cn("bg-neutral-800 text-neutral-200 rounded-full")}
      >
        <Cog />
      </Button>

      <Button
        size={"icon"}
        className={cn("bg-neutral-800 text-neutral-200 rounded-full")}
      >
        <Ghost />
      </Button>
    </div>
  );
}
