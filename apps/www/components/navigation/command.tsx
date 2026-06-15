"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useChatStore } from "@/store/useChat";
import { useCommandStore } from "@/store/useCommandStore";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Plus,
  Home,
  Settings,
  CreditCard,
  Moon,
  Sun,
  CircleDashed,
} from "lucide-react";
import { useConversationStore } from "@/store/useConversation";

export const CommandBox = () => {
  const router = useRouter();
  const { setConversationId } = useChatStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { conversations } = useConversationStore();
  const { open, setOpen } = useCommandStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!open);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "j") {
        event.preventDefault();
        setTheme(theme === "light" ? "dark" : "light");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen, theme]);

  if (!mounted) {
    return null;
  }

  const createConversation = async () => {
    const response = await window.fetch(
      "http://localhost:8787/api/v1/ai/create",
      {
        method: "POST",
      },
    );
    const { data, message } = await response.json();

    if (!response.ok || !data?.conversationId) {
      toast.error(message ?? "Failed to create conversation");
      return null;
    }

    return data.conversationId as string;
  };

  const handleNewChat = async () => {
    const conversationId = await createConversation();
    if (!conversationId) {
      return;
    }

    setConversationId(conversationId);
    router.push(`/c/${conversationId}`);
    setOpen(false);
  };

  const handleBuyCredits = () => {
    router.push("/settings");
    setOpen(false);
  };

  const handleHome = () => {
    router.push("/");
    setOpen(false);
  };

  const handleSettings = () => {
    router.push("/settings");
    setOpen(false);
  };

  const handleChatSelect = (id: string) => {
    router.push(`/c/${id}`);
    setOpen(false);
  };
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    setOpen(false);
  };
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="min-w-md w-full"
    >
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={handleNewChat}>
              <Plus />
              New Chat
            </CommandItem>
            <CommandItem onSelect={handleBuyCredits}>
              <CreditCard />
              Buy more credits
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navigation">
            <CommandItem onSelect={handleHome}>
              <Home />
              Home
            </CommandItem>
            <CommandItem onSelect={handleSettings}>
              <Settings />
              Settings
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Chats">
            {conversations.map((conversation) => (
              <CommandItem
                key={conversation.id}
                onSelect={() => handleChatSelect(conversation.id)}
              >
                <CircleDashed />
                {conversation.title}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Preferences">
            <CommandItem onSelect={toggleTheme}>
              <ThemeIcon />
              Toggle Theme
              <CommandShortcut>⌘J</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};
