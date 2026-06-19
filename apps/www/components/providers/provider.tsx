"use client";

import { authClient } from "@/lib/better-auth/auth-client";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Provider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
