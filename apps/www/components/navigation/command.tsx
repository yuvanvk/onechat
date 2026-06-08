import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@workspace/ui/components/command";

import {
  CircleDashed,
  CircleQuestionMark,
  Cog,
  CreditCard,
  HomeIcon,
  Plus,
  UserRound,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useConversationStore } from "@/store/useConversation";

export const title = "Command Actions Menu";

export const CommandBox = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const { conversations } = useConversationStore();

  useEffect(() => {
    const handlKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", handlKeyDown);

    return () => {
      document.removeEventListener("keydown", handlKeyDown);
    };
  }, []);
  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="min-w-lg bg-[#121212]!"
    >
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => {
                router.push("/");
                setOpen(false);
              }}
            >
              <HomeIcon />
              <span>Home</span>
              <CommandShortcut className="">⌘H</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/settings");
                setOpen(false);
              }}
            >
              <Cog />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Chats">
            {conversations &&
              conversations.length > 0 &&
              conversations.map((conversation) => (
                <CommandItem
                  key={conversation.id}
                  onSelect={() => {
                    router.push(`/c/${conversation.id}`);
                    setOpen(false);
                  }}
                >
                  <CircleDashed />
                  <span>{conversation.title}</span>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                // create a new chat
                // and route to it.
              }}
            >
              <Plus />
              <span>New Chat</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setTheme(theme === "light" ? "dark" : "light");
                setOpen(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4.5"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                <path d="M12 3l0 18"></path>
                <path d="M12 9l4.65 -4.65"></path>
                <path d="M12 14.3l7.37 -7.37"></path>
                <path d="M12 19.6l8.85 -8.85"></path>
              </svg>
              <span>Toggle theme</span>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Account">
            <CommandItem>
              <UserRound />
              <span>Profile</span>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>Billing</span>
            </CommandItem>
            <CommandItem>
              <CircleQuestionMark />
              <span>Help & Support</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};
// className="h-auto w-full max-w-lg rounded-lg border shadow-md"
