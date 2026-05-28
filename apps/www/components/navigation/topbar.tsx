"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Cog, Command, Ghost } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export function Topbar() {
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
        )}
      >
        <Ghost />
      </Button>

      <Button
        size={"icon-sm"}
        className={cn(
          "rounded-full bg-[#2d2d2c] text-neutral-300 border-neutral-700",
        )}
      >
        <Cog />
      </Button>

      <Button
        size={"icon-sm"}
        className={cn(
          "rounded-full bg-[#2d2d2c] text-neutral-300 border-neutral-700",
        )}
      >
        <Command />
      </Button>
    </div>
  );
}
