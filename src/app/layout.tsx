import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus Analytics Platform Demo",
  description: "Nexus Analytics Platform Demo",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script
        defer
        src="https://stg.platform.analytics.nexus/script.js"
        data-website-id="d9d0d65d-2307-41ed-9ca2-1fdb35133f6a"
        data-do-not-track="true"
      />
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
