"use client";

import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";
import { ChangeEvent, useState } from "react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

export const ChatInput = () => {
  const [input, setInput] = useState<string>("");
  const hasInput = input.length > 0;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  return (
    <motion.div
      className={cn(
        "flex items-center gap-2 p-1.5 rounded-xl border border-neutral-800 bg-neutral-900 max-w-md w-full",
      )}
    >
      <Button
        size={"icon"}
        className={cn("bg-[#2d2d2c] text-neutral-100 border-neutral-700")}
      >
        <Plus className="text-neutral-100" />
      </Button>

      <Input
        placeholder="Ask Anything..."
        onChange={handleChange}
        className={cn("bg-transparent! border-none focus:ring-0! p-0! ml-2")}
      />

      <Button size={"icon"} disabled={!hasInput} className={cn("bg-neutral-200")}>
        <motion.div
          animate={{ rotate: input ? "-90deg" : "0deg" }}
          transition={{
            type: "spring",
            damping: 13,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-right"
            aria-hidden="true"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </motion.div>
      </Button>
    </motion.div>
  );
};
