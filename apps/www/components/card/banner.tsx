"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface BannerProps {
  bannerText: string;
  className?: string;
}

export const Banner = ({ bannerText, className }: BannerProps) => {
  const [show, setShow] = useState(true);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -40, filter: "blur(10px)" }}
          animate={{ y: 0, filter: "blur(0px)" }}
          exit={{ y: -40, filter: "blur(10px)" }}
          transition={{ type: "spring", damping: 14, mass: 0.8, duration: 0.3 }}
          className={cn(
            "w-full relative flex items-center justify-center bg-rose-600/90 text-neutral-100 mt-12 absolute leading-0 p-1",
            className,
          )}
        >
          <Button
            size={"icon-sm"}
            variant={"ghost"}
            onClick={() => setShow(false)}
            className="absolute left-1 p-0 hover:bg-transparent! cursor-pointer hover:text-white"
          >
            <X />
          </Button>
          <h1 className="text-sm tracking-tight font-medium">{bannerText}</h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
};