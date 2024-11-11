import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from 'next/head';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Analytics Platform Demo',
  description: 'Experience real-time analytics event tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <script
          defer
          onLoad={() => {
            console.log("umami loaded");
          }}
          src="https://demo.platform.analytics.nexus/script.js"
          data-website-id="89d6ef09-3daf-4593-a1ab-c55245b2b0b0"
        ></script>
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
