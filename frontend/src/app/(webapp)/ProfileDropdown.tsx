"use client";

import Image from "next/image";
import * as Icon from "react-feather";
import React, {useContext, useEffect, useRef, useState} from "react";
import Link from "next/link";
import AuthContext from "@/app/contexts/AuthContext";
import i18n from "@/locales/i18n";

function DropdownLink({ icon, iconAlt, href, children, top = false, bottom = false }: {
    icon: string;
    iconAlt: string;
    href: string;
    children: React.ReactNode;
    top?: boolean;
    bottom?: boolean;
}) {
    return (
        <Link href={href} className={
            "flex py-4 ps-4 pe-8 gap-4 w-full justify-between items-center" +
            " hover:bg-mid-blue hover:text-white transition-all group" +
            (top ? " rounded-t-lg" : "") +
            (bottom ? " rounded-b-lg" : "")
        }>
            <Image
                src={icon}
                alt={iconAlt}
                width={20}
                height={20}
                className={"group-hover:invert transition-all"}
            />
            {children}
        </Link>
    );
}

function Dropdown({ togglerRef, setOpened }: {
    togglerRef: React.MutableRefObject<HTMLButtonElement | null>;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const clickHandler = (e: MouseEvent) => {
            if (!dropdownRef.current)
                return;
            if (
                e.target !== dropdownRef.current &&
                !dropdownRef.current?.contains(e.target as Node | null) &&
                e.target !== togglerRef.current &&
                !togglerRef.current?.contains(e.target as Node | null)
            )
                setOpened(false);
        }

        window.addEventListener("click", clickHandler);
        return () => window.removeEventListener("click", clickHandler);
    }, []);

    return (
        <div
            ref={dropdownRef}
            className={"absolute min-w-32 bg-white rounded-lg bottom-0 left-1/2 -translate-x-1/2 translate-y-full shadow-2xl"}
        >
            <DropdownLink
                icon={"/icons/profile.svg"}
                iconAlt={"profile"}
                href={"/profile"}
                top
            >
                {i18n.t("Profile")}
            </DropdownLink>

            <DropdownLink
                icon={"/icons/logout.svg"}
                iconAlt={"logout"}
                href={"/logout"}
                bottom
            >
                {i18n.t("Logout")}
            </DropdownLink>
        </div>
    );
}

export default function ProfileDropdown() {
    const { user } = useContext(AuthContext);
    const togglerRef = useRef<HTMLButtonElement | null>(null);
    const [opened, setOpened] = useState<boolean>(false);

    return (
        <div className="relative">
            <button
                ref={togglerRef}
                className="flex justify-content items-center gap-4 hover:bg-zinc-200 p-2 rounded-lg transition-all relative"
                onClick={() => {
                    setOpened(value => !value);
                }}
            >
                <Image
                    src="/demo/demopfp.jpeg" alt="profile picture"
                    className={"aspect-square rounded-full"}
                    width={40}
                    height={40}
                />

                {user === undefined ? (
                    <div className={"w-20 h-4 bg-zinc-300 animate-pulse rounded-md"} />
                ): (
                    <div>{user?.username}</div>
                )}

                {opened ? <Icon.ChevronUp /> : <Icon.ChevronDown />}
            </button>

            {opened && <Dropdown togglerRef={togglerRef} setOpened={setOpened} />}
        </div>
    );
}
