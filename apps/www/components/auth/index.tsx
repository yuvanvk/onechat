"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { ChevronLeft, FingerprintPattern } from "lucide-react";
import { ModeToggle } from "../mode-toggle";

export const Auth = () => {
  return (
    <div
      className={cn("flex flex-col items-center justify-center min-h-screen")}
    >
      <h1 className="text-4xl font-semibold font-sans tracking-tighter">
        Welcome to Strato AI
      </h1>
      <div
        className={cn(
          "max-w-lg w-full flex flex-col p-5 rounded-xl space-y-5 mt-8",
        )}
      >

        <div className="space-y-2">
          <Label htmlFor="email">Enter your email</Label>
          <Input
            id="email"
            placeholder="yuvan@gmail.com"
            type="email"
            className={cn("bg-white")}
          />
        </div>

        <Button>
          Login
        </Button>

      </div>
    </div>
  );
};
