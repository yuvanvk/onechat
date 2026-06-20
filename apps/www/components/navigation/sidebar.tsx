"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChat";
import { useCommandStore } from "@/store/useCommandStore";
import { Button } from "@/components/ui/button";
import { useConversationStore } from "@/store/useConversation";
import {
  CircleDashed,
  CircleDollarSign,
  Cog,
  LogIn,
  LogOut,
  MoonStar,
  Palette,
  Plus,
  Search,
  Store,
  Sun,
  UserRound,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { System } from "@/components/icons";
import { authClient } from "@/lib/better-auth/auth-client";
import { BACKEND_URL } from "@/lib/config";

export const AppSidebar = () => {
  const router = useRouter();
  const { conversations } = useConversationStore();
  const { setConversationId } = useChatStore();
  const { setOpen } = useCommandStore();
  const { theme, setTheme } = useTheme();
  const pathName = usePathname();

  const { data } = authClient.useSession();

  const { id } = useParams();

  const SIDEBAR_SHORTCUTS = [
    {
      name: "Search",
      icon: Search,
      onClick: () => setOpen(true),
      route: null,
    },
    {
      name: "Home",
      icon: Store,
      onClick: () => router.push("/"),
      route: "/",
    },
  ];

  const FOOTER_ITEMS = [
    {
      name: "Profile",
      icon: UserRound,
      route: "/settings/profile",
    },
    {
      name: "Account Settings",
      icon: Cog,
      route: "/settings/billing",
    },
    {
      name: "Pricing",
      icon: CircleDollarSign,
      route: "/pricing",
    },
  ];

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="bg-background">
        <div className="flex items-center justify-between">
          <img src={"/logo.svg"} width={30} height={30} />
          <SidebarTrigger className="ml-auto text-muted-foreground hover:text-foreground" />
        </div>
        <Button
          className="bg-muted/90 hover:bg-muted text-foreground"
          onClick={async () => {
            const response = await window.fetch(
              `${BACKEND_URL}/api/v1/ai/create`,
              {
                method: "POST",
                credentials: "include",
              },
            );
            const { data } = await response.json();
            if (!response.ok || !data?.conversationId) {
              return;
            }
            const conversationId = data.conversationId;
            setConversationId(conversationId);
            router.push(`/c/${conversationId}`);
          }}
        >
          <Plus />
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {SIDEBAR_SHORTCUTS.map((s) => {
              const Icon = s.icon;
              return (
                <SidebarMenuItem onClick={s.onClick} key={s.name}>
                  <SidebarMenuButton
                    className={cn(
                      "text-muted-foreground hover:text-foreground",
                      pathName === s.route && "text-foreground bg-muted",
                    )}
                  >
                    <Icon />
                    {s.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarMenu className="space-y-1.5">
            {conversations.map((conversation) => (
              <SidebarMenuItem
                onClick={() => {
                  setConversationId(conversation.id);
                  router.push(`/c/${conversation.id}`);
                }}
                key={conversation.id}
                className="whitespace-nowrap"
              >
                <SidebarMenuButton
                  className={cn(
                    "text-muted-foreground hover:text-foreground",
                    id === conversation.id && "text-foreground bg-muted",
                  )}
                >
                  <CircleDashed />
                  {conversation.title}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-background">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="outline-none! focus:ring-0!">
                  <div className="w-5 h-5 bg-blue-500 border border-blue-400 rounded-full" />
                  {data?.user.name}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-63">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex flex-col items-start gap-0 font-semibold pointer-events-none text-sm hover:bg-transparent!">
                    <div>{data?.user.name}</div>
                    <div className="text-neutral-500!">{data?.user.email}</div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuGroup className="space-y-1">
                  {FOOTER_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.name}
                        onClick={() => router.push(item.route)}
                        className="text-sm"
                      >
                        <Icon className="text-neutral-400" />
                        {item.name}
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuItem className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="text-neutral-400" />
                      Credits
                    </div>
                    <div className="text-muted-foreground">
                      {data?.user.creditBalance}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuGroup className="space-y-1">
                  <DropdownMenuItem className="text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Palette className="text-neutral-400" />
                      <div>Theme</div>
                    </div>

                    <div className="rounded-full border border-border bg-muted flex items-center gap-0 p-0.5 relative">
                      {[
                        {
                          value: "system",
                          icon: System,
                          size: 12,
                          label: "System",
                        },
                        { value: "light", icon: Sun, size: 12, label: "Light" },
                        {
                          value: "dark",
                          icon: MoonStar,
                          size: 12,
                          label: "Dark",
                        },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isActive = theme === item.value;
                        return (
                          <Tooltip key={item.value}>
                            <TooltipTrigger asChild>
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTheme(item.value);
                                }}
                                className="relative z-10 cursor-pointer rounded-full p-1"
                              >
                                {isActive && (
                                  <motion.div
                                    layoutId="theme-indicator"
                                    className="absolute inset-0 rounded-full border bg-background shadow-sm z-0"
                                    transition={{
                                      type: "spring",
                                      stiffness: 400,
                                      damping: 30,
                                    }}
                                  />
                                )}
                                <Icon
                                  size={item.size}
                                  className={cn(
                                    "relative z-10 transition-colors",
                                    isActive
                                      ? "text-foreground"
                                      : "text-neutral-400",
                                  )}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{item.label}</TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-sm"
                    onClick={() => {
                      if (data?.session) {
                        authClient.signOut();
                      } else {
                        router.push("/signup");
                      }
                    }}
                  >
                    {data?.session ? (
                      <>
                        <LogOut className="text-neutral-400" />
                        Sign Out
                      </>
                    ) : (
                      <>
                        <LogIn className="text-neutral-400" />
                        Log In
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className="w-fit font-medium">
                  ${" "}
                  {data?.user.creditBalance &&
                    (data.user.creditBalance * 0.0001).toFixed(2)}
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
