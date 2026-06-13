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
  title: "OneChat - All in One AI Chat",
  description: "The all-in-one AI chat platform. Access multiple AI models in one place.",
  keywords: ["AI", "chat", "assistant", "GPT", "Claude", "Gemini"],
  authors: [{ name: "OneChat" }],
  creator: "OneChat",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://onechat.app",
    siteName: "OneChat",
    title: "OneChat - All in One AI Chat",
    description: "The all-in-one AI chat platform. Access multiple AI models in one place.",
    images: [
      {
        url: "https://onechat.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "OneChat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OneChat - All in One AI Chat",
    description: "The all-in-one AI chat platform. Access multiple AI models in one place.",
    images: ["https://onechat.app/og-image.png"],
  },
  icons: {
    icon: "/logo.svg",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
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
        <Toaster />
      </body>
    </html>
  );
}
