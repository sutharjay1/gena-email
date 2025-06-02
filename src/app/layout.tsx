import Header from "@/features/global/header";
import { ThemeProvider } from "@/features/global/theme-provider";
import { QueryProvider } from "@/features/providers/query-provider";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || ""),
  title: "Gena Email - OSS email generation platform",
  description:
    "Gena Email is an AI-powered email generation platform that helps you create professional emails quickly and easily. Built on top of react.email and styled with Tailwind CSS, it combines the power of AI with beautiful, responsive email templates. Simply provide a prompt, and Gena Email will generate a well-crafted email for you.",
  keywords: [
    "React",
    "email templates",
    "email components",
    "Tailwind CSS",
    "open-source",
    "React UI components",
    "React UI email components",
    "React UI email templates",
    "Gena Email",
    "Gena Email Templates",
    "Gena Email Components",
    "Gena Email Templates",
  ],
  authors: [{ name: "Jay Suthar", url: "https://peerlist.io/sutharjay" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-[100dvh] bg-background font-sans antialiased", fontSans.variable)}>
        {/* <PostHogProvider> */}
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
              <Header />
              {/* <Illustration /> */}
              <div className="h-[calc(100vh-10rem)] w-full">{children}</div>
            </div>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
        {/* </PostHogProvider> */}
      </body>
    </html>
  );
}
