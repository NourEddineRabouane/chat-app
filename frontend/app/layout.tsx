import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

import AuthProvider from "@/providers/AuthProvider";
import Navbar from "@/features/common/NavBar";
import QueryProvider from "@/providers/QueryProvider";
import { StompProvider } from "@/providers/StompProvider";
import { PresenceProvider } from "@/providers/PresenceProvider";
import { TypingProvider } from "@/providers/TypingProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chat application",
  description: "A scalable chat application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full text-navy-950">
        <AuthProvider>
          <StompProvider>
            <PresenceProvider>
              <TypingProvider>
                <QueryProvider>
                  <Navbar />
                  <main className="min-h-screen pl-16">{children}</main>
                </QueryProvider>
              </TypingProvider>
            </PresenceProvider>
          </StompProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
