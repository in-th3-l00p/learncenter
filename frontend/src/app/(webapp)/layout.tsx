import React from "react";
import AuthContextProvider from "@/app/(webapp)/AuthContextProvider";
import {Header} from "@/app/(webapp)/Header";
import getAuthenticated from "@/utils/getAuthenticated";
import {redirect} from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await getAuthenticated() ;
    if (user === undefined)
        redirect("/login");
    return (
        <section className="min-w-screen min-h-screen">
            <AuthContextProvider>
                <Header />
                {children}
            </AuthContextProvider>
        </section>
    );
}