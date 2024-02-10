import Image from "next/image";
import Link from "next/link";
import React from "react";

import getAuthenticated from "@/utils/getAuthenticated";

function HeaderLink({
    href, children,

}: {
    href: string,
    children: React.ReactNode
}) {
    return (
        <Link
            className={"hover:text-mid-blue transition-colors"}
            href={href}
        >
            {children}
        </Link>
    );
}

async function Header() {
    const user = await getAuthenticated();

    return (
        <header className={"bg-white text-black flex p-4 gap-8 sm:px-16 md:px-32 lg:px-64 items-center"}>
            <Link
                href={"/"}
                className={"flex items-center gap-4 md:me-12"}
            >
                <Image
                    src={"/logo.svg"}
                    alt={"logo"}
                    width={50}
                    height={50}
                />
                <h2 className={"text-2xl"}>Learn<span className={"text-mid-blue font-bold"}>Center</span></h2>
            </Link>
            <div className={"flex items-center gap-4 me-auto"}>
                <HeaderLink href={"/about"}>About</HeaderLink>
                <HeaderLink href={"/pricing"}>Pricing</HeaderLink>
                <HeaderLink href={"/contact"}>Contact</HeaderLink>
            </div>

            <div className={"flex items-center gap-4"}>
            {!!user ? (
                <>
                    <HeaderLink href={"/dashboard"}>Dashboard</HeaderLink>
                    <HeaderLink href={"/logout"}>Logout</HeaderLink>
                </>
            ): (
                <>
                    <HeaderLink href={"/login"}>Login</HeaderLink>
                    <HeaderLink href={"/register"}>Register</HeaderLink>
                </>
            )}
            </div>
        </header>
    );
}

function FooterLink({
    href, children
}: {
    href: string,
    children: React.ReactNode
}) {
    return (
        <Link
            className={"hover:text-zinc-500 transition-colors"}
            href={href}
        >
            {children}
        </Link>
    );
}

async function Footer() {
    return (
        <footer className={"bg-green-blue pt-8 pb-4 flex flex-col gap-8 justify-center items-center text-white"}>
            <div className={"grid grid-cols-2 gap-4"}>
                <div className={"border-r pe-4"}>
                    <div className={"flex items-center flex-col gap-4 pb-4 border-b mb-4"}>
                        <Image
                            src={"/whitelogo.svg"}
                            alt={"white logo"}
                            width={50}
                            height={50}
                        />
                        <h2>
                            <span className={"text-xl font-bold"}>LearnCenter</span> by Tișcă Cătălin
                        </h2>
                    </div>

                    <div className="flex flex-col gap-1 items-end">
                        <FooterLink href={"/"}>Home</FooterLink>
                        <FooterLink href={"/about"}>About</FooterLink>
                        <FooterLink href={"/pricing"}>Pricing</FooterLink>
                        <FooterLink href={"/login"}>Login</FooterLink>
                        <FooterLink href={"/register"}>Register</FooterLink>
                    </div>
                </div>
                <div className={"flex flex-col gap-1 items-start justify-center"}>
                    <FooterLink href={"/"}>some</FooterLink>
                    <FooterLink href={"/about"}>political</FooterLink>
                    <FooterLink href={"/pricing"}>stuff</FooterLink>
                    <FooterLink href={"/login"}>idk</FooterLink>
                </div>
            </div>

            <p className={"font-bold"}>All rights reserved ©</p>
        </footer>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <main className="min-h-screen flex flex-col">
                <Header />
                {children}
            </main>
            <Footer />
        </>
    );
}
