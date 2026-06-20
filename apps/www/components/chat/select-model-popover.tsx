"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useModel } from "@/store/useModel";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Bot,
  Brain,
  Code2,
  Eye,
  Filter,
  Globe,
  Image,
  Lock,
  Search,
  Star,
} from "lucide-react";
import { IoChatbubbleOutline } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/better-auth/auth-client";
import { ModelCapability } from "@/lib/supported-models/models";

const CAPABILITY_FILTERS: { key: ModelCapability; icon: any; label: string }[] = [
  { key: "text", icon: IoChatbubbleOutline, label: "Text" },
  { key: "vision", icon: Eye, label: "Vision" },
  { key: "reasoning", icon: Brain, label: "Reasoning" },
  { key: "coding", icon: Code2, label: "Coding" },
  { key: "image-gen", icon: Image, label: "Image Gen" },
  { key: "multilingual", icon: Globe, label: "Multilingual" },
  { key: "multi-agent", icon: Bot, label: "Multi-Agent" },
];

export const SelectModelPopover = () => {
  const {
    setModelName,
    setModel,
    modelName,
    supportedModels,
    addToFavourites,
    removeFromFavourites,
    fetch: fetchFavourites,
  } = useModel();
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [provider, setProvider] = useState("favourites");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ModelCapability[]>([]);

  const { data } = authClient.useSession();
  const userPlan = data?.user.plan ?? "free";  
  
  const hasSearch = search.length > 0;

  const modelsToDisplayBasedOnProvider = supportedModels
    .filter((x) => x.id == provider)
    .flatMap((x) => (provider === "favourites" ? x.favourites : x.models));

  const modelsBasedOnSearch = supportedModels.flatMap((provider) =>
    (provider.models ?? []).filter(
      (m) =>
        m.id.toLowerCase().includes(search.toLowerCase()) ||
        m.displayName.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  let displayModels = hasSearch
    ? modelsBasedOnSearch
    : modelsToDisplayBasedOnProvider;

  if (activeFilters.length > 0) {
    displayModels = displayModels.filter((m) =>
      activeFilters.some((f) => m?.capabilities.includes(f)),
    );
  }

  const toggleFilter = (cap: ModelCapability) => {
    setActiveFilters((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap],
    );
  };

  const filterRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
      setFilterOpen(false);
    }
  }, []);

  useEffect(() => {
    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen, handleClickOutside]);

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <div className="relative w-fit">
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 hover:bg-accent rounded-lg px-2 py-1 max-w-48",
          "cursor-pointer transition-all duration-150 select-none",
          open && "bg-accent",
        )}
      >
        <div
          className={cn(
            "text-[13px] text-muted-foreground truncate",
            open && "text-foreground",
          )}
        >
          {modelName}
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
          className={cn("text-muted-foreground", open && "text-foreground")}
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
              "w-112.5 min-h-125 max-h-125 rounded-xl bg-popover text-popover-foreground border border-border overflow-hidden",
              "absolute -bottom-130 left-1 flex flex-col gap-2",
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

              <div className="relative" ref={filterRef}>
                <Button
                  variant={"ghost"}
                  size={"icon-xs"}
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter
                    className={cn(activeFilters.length > 0 && "text-blue-500")}
                  />
                </Button>
                {filterOpen && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-popover border border-border rounded-lg shadow-lg p-1.5 z-50">
                    {CAPABILITY_FILTERS.map(({ key, icon: Icon, label }) => (
                      <button
                        key={key}
                        onClick={() => toggleFilter(key)}
                        className={cn(
                          "flex items-center gap-2 w-full px-2 py-1.5 text-xs rounded-md transition-colors",
                          activeFilters.includes(key)
                            ? "bg-blue-500/10 text-blue-500"
                            : "hover:bg-accent text-muted-foreground",
                        )}
                      >
                        <Icon size={14} />
                        {label}
                      </button>
                    ))}
                    {activeFilters.length > 0 && (
                      <>
                        <div className="h-px bg-border my-1 mx-2" />
                        <button
                          onClick={() => setActiveFilters([])}
                          className="text-xs text-muted-foreground hover:text-foreground w-full text-left px-2 py-1 hover:bg-accent rounded-md"
                        >
                          Clear filters
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={cn("flex-1 relative")}>
              {!hasSearch && (
                <div
                  className={cn(
                    "absolute inset-y-0 bg-background-muted w-15 rounded-tr-xl border-r border-t border-neutral-300 dark:border-neutral-800",
                    "flex flex-col gap-7 items-center py-4 overflow-y-scroll scrollbar-hidden",
                  )}
                >
                  {supportedModels.map((model, idx) => {
                  const Icon = model.icon;
                    return (
                      <div key={idx} className="relative">
                        {provider === model.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ ease: "linear", duration: 0.1 }}
                            className="w-px h-6 bg-neutral-300 right-[-19px] absolute top-1/2 -translate-y-2/3"
                          />
                        )}

                        <Tooltip>
                          <TooltipTrigger>
                            <div
                              key={model.id}
                              onClick={() => setProvider(model.id)}
                              className="cursor-pointer"
                            >
                              <Icon size={20} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            {model.id}
                          </TooltipContent>
                        </Tooltip>
                        {model.id === "favourites" && <hr className="mt-3 " />}
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
                {displayModels.length === 0 && (
                  <span className="text-sm text-neutral-500 text-center">
                    No results found.
                  </span>
                )}
                {displayModels.length > 0 &&
                  displayModels.map((model) => {
                    const isLocked = userPlan === "free" && model?.free === false;
                    return (
                      <button
                        disabled={isLocked}
                        key={model?.id}
                        onClick={() => {
                          setModel(model?.id!);
                          setModelName(model?.displayName!);
                        }}
                        className={cn("flex flex-col select-none transition-colors",
                          isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <div className="text-sm font-medium">
                              {model?.displayName}
                            </div>
                            <Button
                              asChild
                              onClick={async (e) => {
                                e.stopPropagation();
                                supportedModels[0].favourites!.some((f) => f.id === model?.id)
                                  ? removeFromFavourites(model?.id!)
                                  : addToFavourites(model!);
                              }}
                              size={"icon-sm"}
                              variant={"ghost"}
                            >
                              {isLocked ? <Lock className="w-4 h-4"/> : <Star
                                className="w-4 h-4"
                                stroke={
                                  supportedModels[0].favourites?.find(
                                    (x) => x.id == model?.id,
                                  )
                                    ? "#FFD700"
                                    : "#A3A3A3"
                                }
                                fill={
                                  supportedModels[0].favourites?.find(
                                    (x) => x.id == model?.id,
                                  )
                                    ? "#FFD700"
                                    : ""
                                }
                                size={10}
                              />}
                            </Button>
                          </div>

                          <div
                            className="flex items-center gap-2 bg-neutral-200
                          dark:bg-neutral-800 px-1 py-1 rounded-lg text-neutral-600 dark:text-neutral-300"
                          >
                            {model?.capabilities &&
                              model?.capabilities.map((cap, idx) => {
                                const size = 12;
                                switch (cap) {
                                  case "coding":
                                    return (
                                      <Tooltip key={idx}>
                                        <TooltipTrigger>
                                          <Code2 size={size} />
                                        </TooltipTrigger>
                                        <TooltipContent>{cap}</TooltipContent>
                                      </Tooltip>
                                    );
                                  case "image-gen":
                                    return (
                                      <Tooltip key={idx}>
                                        <TooltipTrigger>
                                          <Image size={size} />
                                        </TooltipTrigger>
                                        <TooltipContent>{cap}</TooltipContent>
                                      </Tooltip>
                                    );

                                  case "reasoning":
                                    return (
                                      <Tooltip key={idx}>
                                        <TooltipTrigger>
                                          <Brain size={size} />
                                        </TooltipTrigger>
                                        <TooltipContent>{cap}</TooltipContent>
                                      </Tooltip>
                                    );
                                  case "vision":
                                    return (
                                      <Tooltip key={idx}>
                                        <TooltipTrigger>
                                          <Eye size={size} />
                                        </TooltipTrigger>
                                        <TooltipContent>{cap}</TooltipContent>
                                      </Tooltip>
                                    );
                                  case "text":
                                    return (
                                      <Tooltip key={idx}>
                                        <TooltipTrigger>
                                          <IoChatbubbleOutline size={size} />
                                        </TooltipTrigger>
                                        <TooltipContent>{cap}</TooltipContent>
                                      </Tooltip>
                                    );
                                  case "multilingual":
                                    return (
                                      <Tooltip key={idx}>
                                        <TooltipTrigger>
                                          <Globe size={size} />
                                        </TooltipTrigger>
                                        <TooltipContent>{cap}</TooltipContent>
                                      </Tooltip>
                                    );
                                  case "multi-agent":
                                    return (
                                      <Tooltip key={idx}>
                                        <TooltipTrigger>
                                          <Bot size={size} />
                                        </TooltipTrigger>
                                        <TooltipContent>{cap}</TooltipContent>
                                      </Tooltip>
                                    );
                                }
                              })}
                          </div>
                        </div>
                        <div className="text-xs text-neutral-500 text-left">
                          {model?.description}
                        </div>
                      </button>
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
