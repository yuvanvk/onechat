import "./globals.css"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "@/components/providers/provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneChat",
  description: "The all-in-one AI chat platform. Access multiple AI models in one place.",
  keywords: ["AI", "chat", "assistant", "GPT", "Claude", "Gemini"],
  authors: [{ name: "OneChat" }],
  creator: "OneChat",
  icons: {
    icon: "/logo.svg",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistMono.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="selection:bg-primary selection:text-primary-foreground font-sans">
        <Provider>{children}</Provider>
        <Toaster position="top-right" offset={5} closeButton toastOptions={{
          className: "border dark:bg-[#121212]! border-neutral-800! shadow-sm! rounded-xl!"
        }}/>
      </body>
    </html>
  );
}
