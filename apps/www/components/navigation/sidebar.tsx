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
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useChatStore } from "@/store/useChat";
import { Button } from "@/components/ui/button";
import { useConversationStore } from "@/store/useConversation";
import { CircleDashed, Plus, Search, Store } from "lucide-react";

export const AppSidebar = () => {
  const router = useRouter();
  const { conversations, fetch } = useConversationStore();
  const { setConversationId } = useChatStore();
  const pathName = usePathname();

  const { id } = useParams();

  const SIDEBAR_SHORTCUTS = [
    {
      name: "Search",
      icon: Search,
      onClick: () => "",
      route: null,
    },
    {
      name: "Home",
      icon: Store,
      onClick: () => router.push("/"),
      route: "/",
    },
  ]

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="bg-background">
        <div className="flex items-center justify-between">
          <img src={"/logo.svg"} width={30} height={30}/>
          <SidebarTrigger className="ml-auto text-muted-foreground hover:text-foreground"/>
        </div>
        <Button className="bg-muted/90 hover:bg-muted text-foreground">
          <Plus />
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarMenu>
            {SIDEBAR_SHORTCUTS.map((s) => {
              const Icon = s.icon
              return <SidebarMenuItem onClick={s.onClick} key={s.name}>
              <SidebarMenuButton className={cn(
                "text-muted-foreground hover:text-foreground",
                pathName === s.route && "text-foreground bg-muted"
              )}>
                <Icon />
                {s.name}
              </SidebarMenuButton>
            </SidebarMenuItem>
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarMenu
            className="space-y-1.5"
          >
            {conversations.map((conversation) => (
              <SidebarMenuItem
                onClick={() => {
                  setConversationId(conversation.id)
                  router.push(`/c/${conversation.id}`)
                }}
                key={conversation.id}
              >
                <SidebarMenuButton
                  className={cn(
                    "text-muted-foreground hover:text-foreground",
                    id === conversation.id && "text-foreground bg-muted"
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
    </Sidebar>
  );
};
