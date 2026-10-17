import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

import AuthProvider from "@/providers/AuthProvider";
import Navbar from "@/features/common/NavBar";
import QueryProvider from "@/providers/QueryProvider";
import { StompProvider } from "@/providers/StompProvider";
import { PresenceProvider } from "@/providers/PresenceProvider";
import { TypingProvider } from "@/providers/TypingProvider";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chat application",
  description: "A scalable chat application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${quicksand.variable} h-full antialiased`}>
      <body className="h-dvh text-[14px] text-ink-600 md:p-5">
        <AuthProvider>
          <StompProvider>
            <PresenceProvider>
              <TypingProvider>
                <QueryProvider>
                  {/* The floating shell from the mockup: rail + page content */}
                  <div className="mx-auto flex h-full max-w-[1400px] overflow-hidden bg-surface md:rounded-3xl md:shadow-shell">
                    <Navbar />
                    <main className="thin-scroll min-w-0 flex-1 overflow-y-auto">
                      {children}
                    </main>
                  </div>
                </QueryProvider>
              </TypingProvider>
            </PresenceProvider>
          </StompProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
