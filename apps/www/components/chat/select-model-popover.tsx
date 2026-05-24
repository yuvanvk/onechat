"use client";

import { useState } from "react";
import { useModel } from "@/store/useModel";
import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { SELECT_MODELS } from "@/lib/supported-models/models";
import { Brain, Code2, Eye, Filter, Image, Search, Star } from "lucide-react";

export const SelectModelPopover = () => {
  const { model, setModel } = useModel();
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [provider, setProvider] = useState("favourites");

  const hasSearch = search.length > 0;

  const modelsToDisplayBasedOnProvider = SELECT_MODELS
    .filter((x) => x.id == provider)
    .flatMap((x) => (provider === "favourites" ? x.favourites : x.models));

  const modelsBasedOnSearch = SELECT_MODELS
    .flatMap((provider) => (provider.models ?? [])
    .filter((m) => 
      m.id.toLowerCase().includes(search.toLowerCase()) 
      || m.displayName.toLowerCase().includes(search.toLowerCase()) 
      || m.description.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const displayModels = hasSearch ? modelsBasedOnSearch : modelsToDisplayBasedOnProvider;

  return (
    <div className="relative w-fit">
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 hover:bg-[#1C1C1C] rounded-lg px-2 py-1",
          "cursor-pointer transition-all duration-150 select-none",
          open && "bg-[#1C1C1C]",
        )}
      >
        <div
          className={cn(
            "text-[13px] text-neutral-400",
            open && "text-neutral-200",
          )}
        >
          Kimi K2
        </div>
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
          className={cn("text-neutral-400", open && "text-neutral-200")}
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
              "w-[450px] min-h-[500px] max-h-[500px] rounded-xl bg-[#121212] border border-neutral-800 overflow-hidden",
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
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(
                    "bg-transparent! rounded-none border-none focus:ring-0! p-0",
                  )}
                  placeholder="Search models..."
                />
              </div>

              <Button variant={"ghost"} size={"icon-xs"}>
                <Filter />
              </Button>
            </div>

            <div className={cn("flex-1 relative")}>
              {!hasSearch && (
                <div
                  className={cn(
                    "absolute inset-y-0 bg-neutral-950/50 w-15 rounded-tr-xl border-r border-t border-neutral-900",
                    "flex flex-col gap-5 items-center py-4 overflow-y-scroll scrollbar-hidden",
                  )}
                >
                  {SELECT_MODELS.map((model, idx) => {
                    const Icon = model.icon;
                    return (
                      <div key={idx} className="relative">
                        {provider === model.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ ease: "linear", duration: 0.1 }}
                            className="w-px h-6 bg-neutral-300 right-[-13.5px] absolute top-1/2 -translate-y-1/2"
                          />
                        )}
                        <Button
                          key={model.id}
                          size={"icon"}
                          variant={"ghost"}
                          onClick={() => setProvider(model.id)}
                        >
                          <Icon className="hover:bg-neutral-100 bg-neutral-800 cursor-pointer" />
                        </Button>
                        {model.id === "favourites" && <hr className="mt-3" />}
                      </div>
                    );
                  })}
                </div>
              )}

              <div
                className={cn(
                  "absolute inset-y-0 right-0",
                  hasSearch ? "left-0" : "left-15",
                  "flex flex-col gap-5 py-5 px-4 overflow-y-scroll scrollbar-hidden",
                )}
              >
                {displayModels.length === 0 && <span className="text-sm text-neutral-500 text-center">No results found.</span>} 
                {displayModels.length > 0 &&
                  displayModels.map((model) => {
                    return (
                      <div
                        key={model?.id}
                        className="flex flex-col select-none cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <div className="text-sm font-medium">
                              {model?.displayName}
                            </div>
                            <Button
                              onClick={() =>
                                SELECT_MODELS[0].favourites?.push(model!)
                              }
                              size={"icon-sm"}
                              variant={"ghost"}
                            >
                              <Star
                                stroke={
                                  SELECT_MODELS[0].favourites?.find(
                                    (x) => x.id == model?.id,
                                  )
                                    ? "#FFD700"
                                    : "#A3A3A3"
                                }
                                fill={
                                  SELECT_MODELS[0].favourites?.find(
                                    (x) => x.id == model?.id,
                                  )
                                    ? "#FFD700"
                                    : ""
                                }
                                size={10}
                              />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2 bg-neutral-800 px-1 py-1 rounded-lg text-neutral-400">
                            {model?.capabilities.map((cap, idx) => {
                              const size = 12;
                              switch (cap) {
                                case "code":
                                  return <Code2 size={size} key={idx}/>;
                                case "image-gen":
                                  return <Image size={size} key={idx}/>;
                                case "reasoning":
                                  return <Brain size={size} key={idx}/>;
                                case "vision":
                                  return <Eye size={size} key={idx}/>;
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
