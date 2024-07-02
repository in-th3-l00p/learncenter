import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import React from "react";
import { getServerSession } from "next-auth";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import LayoutProvider from "@/components/layoutProvider";

import "@/lib/mongoose";
import User from "@/models/User";
import UserContextProvider from "@/components/UserContextProvider";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Toaster } from "@/components/ui/toaster";

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
          <head />
          <body
            className={clsx(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable,
            )}
          >
            <Providers
              themeProps={{ attribute: "class", defaultTheme: "dark" }}
            >
              <div className="relative flex flex-col h-screen">
                <Navbar />
                <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                  {children}
                </main>
              </div>
            </Providers>
            <Toaster />
          </body>
        </html>
      </LayoutProvider>
    </UserContextProvider>
  );
}
