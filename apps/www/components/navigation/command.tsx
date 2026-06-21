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
import { BACKEND_URL } from "@/lib/config";

export const CommandBox = () => {
  const router = useRouter();
  const { setConversationId, setMessages } = useChatStore();
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
      `${BACKEND_URL}/api/v1/ai/create`,
      {
        method: "POST",
        credentials: "include",
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
    setMessages([])
    setOpen(false);
    router.push(`/c/${conversationId}`);
  };

  const handleBuyCredits = () => {
    router.push("/pricing");
    setOpen(false);
  };

  const handleHome = () => {
    setMessages([])
    setOpen(false);
    router.push("/");
  };

  const handleSettings = () => {
    setOpen(false);
    router.push("/settings/profile");
  };

  const handleChatSelect = (id: string) => {
    setOpen(false);
    router.push(`/c/${id}`);
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
      className="min-w-0 w-[95vw] max-w-[500px] md:min-w-md"
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
