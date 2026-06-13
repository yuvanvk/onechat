import type { ReactNode } from "react";

export type CommandGroupId =
  | "navigation"
  | "chats"
  | "actions"
  | "theme"
  | "account";

export type AppCommand = {
  id: string;
  label: string;
  group: CommandGroupId;
  keywords?: string[];
  icon?: ReactNode;
  shortcut?: string;
  /** When true, the item stays highlighted while active (e.g. current theme). */
  checked?: boolean;
  perform: () => void | Promise<void>;
};

export const COMMAND_GROUP_LABELS: Record<CommandGroupId, string> = {
  navigation: "Navigation",
  chats: "Chats",
  actions: "Actions",
  theme: "Theme",
  account: "Account",
};

export const COMMAND_GROUP_ORDER: CommandGroupId[] = [
  "navigation",
  "chats",
  "actions",
  "theme",
  "account",
];
