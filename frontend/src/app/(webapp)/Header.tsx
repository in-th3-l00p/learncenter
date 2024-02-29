import React from "react";
import Link from "next/link";
import getAuthenticated from "@/utils/getAuthenticated";
import Image from "next/image";
import {HeaderLink} from "@/app/(webapp)/HeaderLink";

export async function Header() {
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
                <HeaderLink href={"/dashboard"}>Dashboard</HeaderLink>
                <HeaderLink href={"/institutions"}>Institutions</HeaderLink>
            </div>

            <div className={"flex items-center gap-4"}>
                {!!user ? (
                    <>
                        <HeaderLink href={"/logout"}>Logout</HeaderLink>
                    </>
                ) : (
                    <>
                        <HeaderLink href={"/login"}>Login</HeaderLink>
                        <HeaderLink href={"/register"}>Register</HeaderLink>
                    </>
                )}
            </div>
        </header>
    );
}