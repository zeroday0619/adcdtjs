import type { Metadata } from "next";

import "../globals.css";
import { buildSiteMetadata } from "@/lib/site";

export const metadata: Metadata = buildSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="diagnosis">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-base-100 focus:px-4 focus:py-2 focus:text-sm focus:text-base-content"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
