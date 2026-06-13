"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { useAppCommands } from "@/hooks/use-app-commands";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { COMMAND_GROUP_LABELS, COMMAND_GROUP_ORDER } from "@/lib/commands/types";

export const title = "Command Actions Menu";

export const CommandBox = () => {
  const { open, setOpen, close } = useCommandPalette();
  const { groupedCommands } = useAppCommands(close);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const allCommands = useMemo(
    () =>
      COMMAND_GROUP_ORDER.flatMap((groupId) =>
        groupedCommands[groupId]?.map((command) => ({
          ...command,
          groupId,
        })) ?? [],
      ),
    [groupedCommands],
  );

  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      return allCommands;
    }

    const searchText = query.toLowerCase();
    return allCommands.filter((command) => {
      const keywords = [command.label, ...(command.keywords ?? [])].join(" ").toLowerCase();
      return keywords.includes(searchText);
    });
  }, [allCommands, query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelectedIndex(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((current) => Math.min(current + 1, filteredCommands.length - 1));
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((current) => Math.max(current - 1, 0));
      }

      if (event.key === "Enter") {
        event.preventDefault();
        filteredCommands[selectedIndex]?.perform();
      }

      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [close, filteredCommands, open, selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isModKey = event.metaKey || event.ctrlKey;
      if (isModKey && event.key.toLowerCase() === "n") {
        event.preventDefault();
        groupedCommands.actions?.find((command) => command.id === "action-new-chat")?.perform();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [groupedCommands.actions]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <div className="fixed inset-x-0 top-[10%] z-50 mx-auto w-full max-w-2xl px-4">
        <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white/95 shadow-[0_25px_50px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:border-neutral-800 dark:bg-neutral-950/95">
          <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
            <Search className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search commands..."
              className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedIndex(0);
                  inputRef.current?.focus();
                }}
                className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="max-h-[520px] overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="px-6 py-16 text-center text-sm text-neutral-500 dark:text-neutral-400">
                No results found.
              </div>
            ) : (
              COMMAND_GROUP_ORDER.map((groupId) => {
                const commands = filteredCommands.filter((command) => command.groupId === groupId);
                if (!commands.length) {
                  return null;
                }

                return (
                  <div key={groupId} className="border-b border-neutral-200 last:border-none dark:border-neutral-800">
                    <div className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-500">
                      {COMMAND_GROUP_LABELS[groupId]}
                    </div>
                    {commands.map((command, index) => {
                      const isSelected = selectedIndex === filteredCommands.findIndex((item) => item.id === command.id);
                      return (
                        <button
                          key={command.id}
                          type="button"
                          onClick={() => command.perform()}
                          onMouseEnter={() => setSelectedIndex(filteredCommands.findIndex((item) => item.id === command.id))}
                          className={`flex w-full items-center justify-between gap-3 px-6 py-3 text-left transition ${
                            isSelected
                              ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                              : "text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-900"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {command.icon ? (
                              <span className="shrink-0 text-neutral-500 dark:text-neutral-400">{command.icon}</span>
                            ) : null}
                            <span className="truncate text-sm font-medium">{command.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {command.shortcut ? (
                              <span className="hidden rounded-full border border-neutral-200 bg-neutral-100 px-2 py-1 text-[11px] font-semibold text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 sm:inline-flex">
                                {command.shortcut}
                              </span>
                            ) : null}
                            {isSelected ? <ChevronRight className="h-4 w-4 text-neutral-500 dark:text-neutral-400" /> : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <kbd className="rounded bg-neutral-100 px-2 py-1 text-[11px] font-semibold text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">↑↓</kbd>
                Navigate
              </span>
              <span className="inline-flex items-center gap-2">
                <kbd className="rounded bg-neutral-100 px-2 py-1 text-[11px] font-semibold text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">↵</kbd>
                Run
              </span>
              <span className="inline-flex items-center gap-2">
                <kbd className="rounded bg-neutral-100 px-2 py-1 text-[11px] font-semibold text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">Esc</kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
