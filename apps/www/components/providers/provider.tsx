"use client";

import { CommandBox } from "../navigation/command";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "@workspace/ui/components/tooltip";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
      <TooltipProvider>
        <CommandBox />
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
