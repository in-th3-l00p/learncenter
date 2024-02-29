"use client";

import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

export function HeaderLink({
    href, children,
}: {
    href: string,
    children: React.ReactNode
}) {
    "use client";

    const pathname = usePathname();

    return (
        <Link
            className={
                "hover:text-mid-blue transition-colors" +
                " hover:border-b-2 hover:border-b-mid-blue" +
                (pathname === href ? " border-b-2 border-b-mid-blue" : "")
            }
            href={href}
        >
            {children}
        </Link>
    );
}