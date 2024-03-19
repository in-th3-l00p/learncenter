import React from "react";
import Link from "next/link";
import Image from "next/image";
import {HeaderLink} from "@/app/(webapp)/HeaderLink";
import ProfileDropdown from "@/app/(webapp)/ProfileDropdown";

export async function Header() {
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
                <ProfileDropdown />
            </div>
        </header>
    );
}
