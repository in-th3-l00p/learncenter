import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import React from "react";
import { getServerSession } from "next-auth";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import LayoutProvider from "@/components/layoutProvider";

import "@/lib/mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import UserContextProvider from "@/components/UserContextProvider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  const session = await getServerSession(authOptions);

  if (session) user = await User.findById(session.user.id);

  return (
    <UserContextProvider jsonUser={user ? JSON.stringify(user) : null}>
      <LayoutProvider>
        <html suppressHydrationWarning lang="en">
          <head>
            <script async src="https://js.stripe.com/v3/pricing-table.js" />
          </head>
          <body
            className={clsx(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable,
            )}
          >
            <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
              <div className="relative flex flex-col h-screen">
                <Navbar />
                <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                  {children}
                </main>
                <footer className="w-full flex items-center justify-center py-3">
                  <Link
                    isExternal
                    className="flex items-center gap-1 text-current"
                    href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
                    title="nextui.org homepage"
                  >
                    <span className="text-default-600">Powered by</span>
                    <p className="text-primary">NextUI</p>
                  </Link>
                </footer>
              </div>
            </Providers>
          </body>
        </html>
      </LayoutProvider>
    </UserContextProvider>
  );
}
