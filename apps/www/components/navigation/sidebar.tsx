"use client";

import { motion } from "motion/react";
import { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import { useSidebar } from "@/store/useSidebar";
import { Button } from "@workspace/ui/components/button";
import { useConversations } from "@/hooks/useConversations";
import { SidebarToggleIcon } from "@workspace/ui/components/unlumen-ui/sidebar-toggle-icon";

export const Sidebar = () => {
  const router = useRouter();
  const { open } = useSidebar();
  const conversations = useConversations();

  return (
    <motion.div
      animate={{ x: open ? "0%" : "-102%" }}
      transition={{
        duration: 0.2,
        ease: "easeIn",
      }}
      className={cn(
        "flex flex-col max-w-[300px] w-full bg-[#121212] backdrop-blur-lg absolute left-2 inset-y-2 rounded-2xl overflow-hidden",
      )}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          {conversations.length === 0 && (
            <span className="text-sm text-neutral-500 text-center mt-6">
              No chats found.
            </span>
          )}
          {conversations.length > 0 &&
            conversations.map((conversation, idx) => (
              <SideBarItem key={idx} onClick={() => router.push(`/c/${conversation.id}`)}>
                {conversation.title}
              </SideBarItem>
            ))}
        </SidebarGroup>
      </SidebarContent>
    </motion.div>
  );
};

export const SidebarContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col mt-18 px-2.5 py-10", className)}>
      {children}
    </div>
  );
};

export const SidebarGroup = ({ children }: { children: React.ReactNode }) => {
  return <div className={cn("flex flex-col")}>{children}</div>;
};

export const SidebarGroupLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="flex items-start gap-2">
      <div className="flex flex-col gap-[7px]">
        {[0, 1].map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-px w-8",
              idx === 0 ? "bg-neutral-100" : "bg-neutral-600",
            )}
          />
        ))}
      </div>
      <div
        className={cn(
          "text-[15px] capitalize font-normal text-neutral-100 leading-0",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export const SideBarItem = ({
  children,
  className,
  ...props
}: ComponentProps<typeof Button>) => {
  const barVariants = {
    rest: { width: "32px", backgroundColor: "var(--color-neutral-600)" },
    hover: {
      width: "32px",
      backgroundColor: "var(--color-neutral-600)",
    },
  };

  const middleBarVariants = {
    rest: { width: "32px", backgroundColor: "#525252" },
    hover: { width: "45px", backgroundColor: "#00A6F4" },
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className={cn("flex items-center gap-2 cursor-pointer")}
    >
      <motion.div className={cn("flex flex-col gap-[7px]")}>
        {[0, 1, 2].map((_, idx) => (
          <motion.div
            key={idx}
            variants={idx === 1 ? middleBarVariants : barVariants}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn("h-px")}
          />
        ))}
      </motion.div>
      <Button
        variant={"ghost"}
        className={cn(
          "p-0 text-[15px] font-normal bg-transparent hover:bg-transparent!",
          className,
        )}
        {...props}
      >
        <motion.span
          variants={{
            rest: { color: "var(--color-neutral-500)" },
            hover: { color: "#00A6F4" },
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {children}
        </motion.span>
      </Button>
    </motion.div>
  );
};

export const SidebarTrigger = ({ className }: { className?: string }) => {
  const { open, setOpen } = useSidebar();

  return (
    <Button
      size={"icon-lg"}
      variant={"ghost"}
      onClick={() => setOpen(open ? false : true)}
      className={cn("absolute top-4 left-4 z-100", className)}
    >
      <SidebarToggleIcon isOpen={open} />
    </Button>
  );
};
