"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";
import { Brain, Code2, Eye, Filter, Image, Search, Star } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { SELECT_MODELS } from "@/lib/supported-models/models";
import { useModel } from "@/store/useModel";

export const SelectModelPopover = () => {
  const { model, setModel } = useModel();
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState("");

  const modelsToDisplayBasedOnProvider = SELECT_MODELS.filter(
    (x) => x.id == provider,
  ).flatMap((x) => x.models);

  return (
    <div className="relative w-fit">
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 hover:bg-[#1C1C1C] rounded-lg px-2 py-1",
          "cursor-pointer transition-all duration-150 select-none",
          open && "bg-[#1C1C1C] text-neutral-100",
        )}
      >
        <div className="text-[13px]">Kimi K2</div>
        <motion.svg
          animate={{ rotate: open ? "180deg" : "0deg" }}
          transition={{ ease: "easeIn", duration: 0.2 }}
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chevron-down-icon lucide-chevron-down"
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </div>

      {/* Select Model Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1.01 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ ease: "easeInOut", duration: 0.1 }}
            className={cn(
              "w-[450px] min-h-[500px] max-h-[500px] rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden",
              "absolute bottom-[36px] flex flex-col gap-2",
            )}
          >
            {/* Top Search Bar and filter */}
            <div
              className={cn(
                "flex items-center justify-between px-4 py-2 border-b",
              )}
            >
              <div className="flex items-center gap-2">
                <Search size={16} />
                <Input
                  className={cn(
                    "bg-transparent! rounded-none border-none focus:ring-0! p-0",
                  )}
                  placeholder="Search Models..."
                />
              </div>

              <Button variant={"ghost"} size={"icon-sm"}>
                <Filter />
              </Button>
            </div>

            <div className={cn("flex-1 relative")}>
              <div
                className={cn(
                  "absolute inset-y-0 bg-[#121212] w-15 rounded-tr-xl border-r border-t border-[#1f1f1f]",
                  "flex flex-col gap-5 items-center py-4 shadow overflow-y-scroll scrollbar-hidden",
                )}
              >
                {SELECT_MODELS.map((model) => {
                  const Icon = model.icon;
                  return (
                    <div className="relative">
                      <Button
                        key={model.id}
                        size={"icon"}
                        variant={"ghost"}
                        onClick={() => setProvider(model.id)}
                      >
                        <Icon className="hover:bg-neutral-100 bg-neutral-800 cursor-pointer" />
                      </Button>
                      {provider === model.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ ease: "linear", duration: 0.1 }}
                          className="w-px h-6 bg-neutral-300 right-[-13.5px] absolute top-1/2 -translate-y-1/2"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div
                className={cn(
                  "absolute inset-y-0 left-15 right-0",
                  "flex flex-col gap-5 py-5 px-4 overflow-y-scroll scrollbar-hidden",
                )}
              >
                {modelsToDisplayBasedOnProvider.map((model) => {
                  return (
                    <div
                      key={model!.id}
                      className="flex flex-col select-none cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="text-sm font-medium">
                            {model?.displayName}
                          </div>
                          <Button size={"icon-sm"} variant={"ghost"}>
                            <Star size={10} className="text-neutral-400" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-1.5 bg-neutral-800 px-1 py-1 rounded-lg text-neutral-400">
                          {model?.capabilities.map((cap) => {
                            const size = 12;
                            switch (cap) {
                              case "code":
                                return <Code2 size={size} />;
                              case "image-gen":
                                return <Image size={size} />;
                              case "reasoning":
                                return <Brain size={size} />;
                              case "vision":
                                return <Eye size={size} />;
                            }
                          })}
                        </div>
                      </div>
                      <div className="text-xs text-neutral-500">
                        {model?.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
