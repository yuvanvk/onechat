"use client";

import {
  CircleDashed,
  CircleQuestionMark,
  CreditCard,
  HomeIcon,
  Monitor,
  Moon,
  Plus,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  AppCommand,
  COMMAND_GROUP_ORDER,
  CommandGroupId,
} from "@/lib/commands/types";
import { useChatStore } from "@/store/useChat";
import { useConversationStore } from "@/store/useConversation";

async function createConversation() {
  const response = await fetch("http://localhost:8787/api/v1/ai/create", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to create a new chat");
  }

  const { data } = await response.json();
  return data.conversationId as string;
}

export function useAppCommands(onComplete?: () => void) {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { conversations } = useConversationStore();
  const { setConversationId, setMessages } = useChatStore();

  const run = useCallback(
    (action: () => void | Promise<void>) => {
      return async () => {
        await action();
        onComplete?.();
      };
    },
    [onComplete],
  );

  const commands = useMemo<AppCommand[]>(() => {
    const navigationCommands: AppCommand[] = [
      {
        id: "nav-home",
        group: "navigation",
        label: "Home",
        keywords: ["home", "dashboard", "go home"],
        icon: <HomeIcon />,
        shortcut: "⌘H",
        perform: run(() => router.push("/")),
      },
      {
        id: "nav-settings",
        group: "navigation",
        label: "Settings",
        keywords: ["settings", "preferences", "go to settings"],
        icon: <Settings />,
        perform: run(() => router.push("/settings")),
      },
    ];

    const chatCommands: AppCommand[] = conversations.map((conversation) => ({
      id: `chat-${conversation.id}`,
      group: "chats",
      label: conversation.title,
      keywords: [conversation.title, "chat", "conversation", "open chat"],
      icon: <CircleDashed />,
      perform: run(() => {
        setConversationId(conversation.id);
        router.push(`/c/${conversation.id}`);
      }),
    }));

    const actionCommands: AppCommand[] = [
      {
        id: "action-new-chat",
        group: "actions",
        label: "New Chat",
        keywords: ["new chat", "create chat", "start chat"],
        icon: <Plus />,
        shortcut: "⌘N",
        perform: run(async () => {
          const conversationId = await createConversation();
          setMessages([]);
          setConversationId(conversationId);
          router.push(`/c/${conversationId}`);
        }),
      },
    ];

    const themeCommands: AppCommand[] = [
      {
        id: "theme-light",
        group: "theme",
        label: "Light Mode",
        keywords: ["light", "light mode", "theme light"],
        icon: <Sun />,
        checked: theme === "light",
        perform: run(() => setTheme("light")),
      },
      {
        id: "theme-dark",
        group: "theme",
        label: "Dark Mode",
        keywords: ["dark", "dark mode", "theme dark"],
        icon: <Moon />,
        checked: theme === "dark",
        perform: run(() => setTheme("dark")),
      },
      {
        id: "theme-system",
        group: "theme",
        label: "System Theme",
        keywords: ["system", "auto", "system theme"],
        icon: <Monitor />,
        checked: theme === "system" || theme === undefined,
        perform: run(() => setTheme("system")),
      },
      {
        id: "theme-toggle",
        group: "theme",
        label: "Toggle Theme",
        keywords: ["toggle theme", "switch theme", "flip theme"],
        icon: resolvedTheme === "light" ? <Moon /> : <Sun />,
        perform: run(() =>
          setTheme(resolvedTheme === "light" ? "dark" : "light"),
        ),
      },
    ];

    const accountCommands: AppCommand[] = [
      {
        id: "account-profile",
        group: "account",
        label: "Profile",
        keywords: ["profile", "account"],
        icon: <UserRound />,
        perform: run(() => router.push("/settings")),
      },
      {
        id: "account-billing",
        group: "account",
        label: "Billing",
        keywords: ["billing", "subscription", "payment"],
        icon: <CreditCard />,
        perform: run(() => router.push("/settings")),
      },
      {
        id: "account-help",
        group: "account",
        label: "Help & Support",
        keywords: ["help", "support", "docs"],
        icon: <CircleQuestionMark />,
        perform: run(() => {}),
      },
    ];

    return [
      ...navigationCommands,
      ...chatCommands,
      ...actionCommands,
      ...themeCommands,
      ...accountCommands,
    ];
  }, [
    conversations,
    resolvedTheme,
    router,
    run,
    setConversationId,
    setMessages,
    setTheme,
    theme,
  ]);

  const groupedCommands = useMemo(() => {
    return COMMAND_GROUP_ORDER.reduce<
      Partial<Record<CommandGroupId, AppCommand[]>>
    >((groups, groupId) => {
      const items = commands.filter((command) => command.group === groupId);
      if (items.length > 0) {
        groups[groupId] = items;
      }
      return groups;
    }, {});
  }, [commands]);

  return { commands, groupedCommands };
}
