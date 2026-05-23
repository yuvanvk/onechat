"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Cog, Command, Ghost } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export function Topbar() {
  return (
    <div
      className={cn(
        "fixed top-4 right-4 bg-linear-to-b from-[#1A1A1A] to-[#161616] border border-neutral-800 p-1 rounded-2xl",
        "flex items-center gap-0.5",
      )}
    >
      <Button
        size={"icon-lg"}
        className={cn("bg-[#232323] text-neutral-200 rounded-full")}
      >
        <Ghost />
      </Button>

      <Button
        size={"icon-lg"}
        className={cn("bg-[#232323] text-neutral-200 rounded-full")}
      >
        <Cog />
      </Button>
      
      <Button
        size={"icon-lg"}
        className={cn("bg-[#232323] text-neutral-200 rounded-full")}
      >
        <Command />
      </Button>
    </div>
  );
}
