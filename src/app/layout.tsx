
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nexus Analytics Platform Demo',
  description: 'Nexus Analytics Platform Demo',
  icons: {
    icon: '/favicon.ico',
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
        src="https://demo.platform.analytics.nexus/script.js"
        data-website-id="89d6ef09-3daf-4593-a1ab-c55245b2b0b0"
        data-do-not-track="true"
      />
      <body className={inter.className}>{children}</body>
    </html>
  );
}