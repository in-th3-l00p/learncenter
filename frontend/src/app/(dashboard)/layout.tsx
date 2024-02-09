import React from "react";
import {Inter} from "next/font/google";
import {Metadata} from "next";
import AuthContextProvider from "@/app/(dashboard)/AuthContextProvider";
import getAuthenticated from "@/utils/getAuthenticated";
import {redirect} from "next/navigation";


const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "LearnCenter",
    description: "LearnCenter Web Application, designed for handling educational institutions online",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await getAuthenticated() ;
    if (user === undefined)
        redirect("/login");

    return (
        <html lang="en" className={"h-full min-h-screen"}>
            <body className={inter.className + " h-full min-h-screen bg-zinc-100"}>
                <AuthContextProvider>
                    {children}
                </AuthContextProvider>
            </body>
        </html>
    );
}