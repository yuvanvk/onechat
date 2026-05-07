"use client";
import { cn } from "../utils/cn";

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col p-2 rounded-md max-w-sm w-full",
      "bg-neutral-200 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100",
      className,
    )}
  >
    {children}
  </div>
);

const CardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("flex flex-col gap-1.5 w-full", className)}>{children}</div>;

const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("text-3xl font-medium font-sans w-full", className)}>
    {children}
  </div>
);

const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "text-lg font-sans text-neutral-400 dark:text-neutral-600 w-full",
      className,
    )}
  >
    {children}
  </div>
);

const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("flex flex-col gap-2 w-full", className)}>{children}</div>;

const CardFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("items-end", className)}>{children}</div>;

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
