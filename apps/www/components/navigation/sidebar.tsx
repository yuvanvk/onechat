"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@workspace/ui/components/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@workspace/ui/components/dropdown-menu";
import { ComponentProps, useEffect } from "react";
import { useConversationStore } from "@/store/useConversation";
import { useChatStore } from "@/store/useChat";
import { Logo } from "../ui/logo";
import { ChevronDown, CircleDashed } from "lucide-react";

export const AppSidebar = () => {
  const router = useRouter();
  const { open, setOpen } = useSidebar();
  const { conversations, fetch } = useConversationStore();
  const { setConversationId } = useChatStore();

  const { id } = useParams();

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarMenu>
            {conversations.map((conversation) => (
              <SidebarMenuItem
                onClick={() => router.push(`/c/${conversation.id}`)}
                key={conversation.id}
              >
                <SidebarMenuButton>
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
