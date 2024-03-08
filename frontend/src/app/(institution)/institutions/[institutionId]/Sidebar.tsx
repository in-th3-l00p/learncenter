"use client";

import React, {useContext, useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";

import "./layout.scss";
import InstitutionContext from "@/app/(institution)/institutions/[institutionId]/contexts/InstitutionContext";
import AuthContext from "@/app/contexts/AuthContext";
import {getLimitedText} from "@/utils/utils";
import {usePathname} from "next/navigation";
import i18n from "@/locales/i18n";

function ToggleButton({ setOpened, className }: {
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}) {
    return (
        <button
            type={"button"}
            onClick={() => {
                setOpened(opened => !opened);
            }}
            className={
                "w-12 aspect-square p-2 flex justify-center items-center rounded-lg shadow-md" +
                " hover:shadow-lg hover:bg-gray-100 transition-all " +
                className
            }
            title={i18n.t("toggle sidebar")}
        >
            <Image
                src={"/icons/sidebar.svg"}
                alt={i18n.t("toggle sidebar")}
                width={40}
                height={40}
            />
        </button>
    );
}

function SidebarBase({ children }: { children: React.ReactNode }) {
    return (
        <aside
            className={"min-h-screen bg-white flex flex-col"}
            style={{ minWidth: "fit-content" }}
        >
            {children}
        </aside>
    );
}

function SidebarLink({ href, icon, iconAlt, children }: {
    href: string, icon: string, iconAlt: string, children: React.ReactNode
}) {
    "use client";

    const pathname = usePathname();
    const [current, setCurrent] = useState<boolean>(
        window.location.pathname === href
    );

    useEffect(() => {
        setCurrent(pathname === href);
    }, [pathname]);

    return (
        <Link href={href} className={
            "sidebar-link py-4 px-8 flex items-center gap-4" +
            " hover:bg-mid-blue hover:text-white transition-all " +
            (current ? "bg-mid-blue text-white" : "bg-white") + " " +
            (current ? "hover:cursor-default" : "hover:cursor-pointer")
        }>
            <Image
                src={icon}
                alt={iconAlt}
                width={30}
                height={30}
                className={current ? "invert" : ""}
            />

            {children}
        </Link>
    );
}

function InstitutionDisplay() {
    const { institution } = useContext(InstitutionContext);

    return (
        <div className={"inline-flex justify-between items-center py-4 px-8 gap-4"}>
            <div className={"inline-flex items-center gap-4"}>
                <Image
                    src={"/icons/institution.svg"}
                    alt={"institution"}
                    width={30}
                    height={30}
                />
                <p className={"text-wrap"}>{getLimitedText(institution?.name!)}</p>
            </div>

            <button
                type="button"
                className={
                    "w-12 aspect-square p-2 flex justify-center items-center rounded-lg shadow-md" +
                    " hover:sha dow-lg hover:bg-gray-100 transition-all "
                }
                title={i18n.t("change institution")}
                onClick={() => {
                    window.location.href = "/institutions";
                }}
            >
                <Image
                    src={"/icons/logout.svg"}
                    alt={"logout"}
                    width={40}
                    height={40}
                />
            </button>
        </div>
    );
}

function UserDisplay() {
    const { role } = useContext(InstitutionContext);
    const { user, userLoading } = useContext(AuthContext);
    const [opened, setOpened] = useState(false);

    return (
        <>
            <button
                type={"button"}
                className={
                    "inline-flex justify-between items-center py-4 px-8 gap-4 " +
                    "hover:bg-mid-blue hover:text-white transition-all group " +
                    (opened ? "bg-mid-blue text-white" : "bg-white")
                }
                onClick={() => {
                    setOpened(opened => !opened);
                }}
            >
                <div className={"inline-flex items-center gap-4"}>
                    <Image
                        src={"/demo/demopfp.jpeg"}
                        alt={"profile"}
                        width={40}
                        height={40}
                        className={"aspect-square rounded-full"}
                    />
                    {userLoading ?
                        <div className={"w-20 rounded-md p-2 bg-slate-300 animate-pulse"} /> :
                        <div>
                            <p className={"font-semibold"}>{user?.firstName + " " + user?.lastName}</p>
                            <p className={
                                "text-start font-light text-slate-600 text-sm" +
                                " group-hover:text-white transition-all"
                            }>
                                {role}
                            </p>
                        </div>
                    }
                </div>
            </button>
            {opened && (
                <div className={"userAppearAnimation"}>
                    <SidebarLink
                        href={"/logout"}
                        icon={"/icons/logout.svg"}
                        iconAlt={"logout"}
                    >
                        {i18n.t("Logout")}
                    </SidebarLink>
                </div>
            )}
        </>
    );
}

export default function Sidebar() {
    const { institution, role } = useContext(InstitutionContext);
    const [opened, setOpened] = useState(true);

    if (!opened)
        return (
            <SidebarBase>
                <ToggleButton setOpened={setOpened} className={"m-4"} />
            </SidebarBase>
        );
    return (
        <SidebarBase>
            <div className={"inline-flex justify-between items-center gap-4 p-4"}>
                <div className={"inline-flex items-center gap-4"}>
                    <Image
                        src={"/logo.svg"}
                        alt={"logo"}
                        width={50}
                        height={50}
                    />
                    <h2 className={"text-xl me-4"}>
                        Learn
                        <span className={"text-mid-blue font-bold"}>Center</span>
                    </h2>
                </div>

                <ToggleButton setOpened={setOpened} />
            </div>

            <div className={"mb-auto"}>
                <SidebarLink
                    href={`/institutions/${institution?.id}`}
                    icon={"/icons/institution.svg"}
                    iconAlt={"institutions"}
                >
                    {i18n.t("Dashboard")}
                </SidebarLink>

                <SidebarLink
                    href={`/institutions/${institution?.id}/users`}
                    icon={"/icons/users.svg"}
                    iconAlt={"users"}
                >
                    {i18n.t("Users")}
                </SidebarLink>

                <SidebarLink
                    href={`/institutions/${institution?.id}/classrooms`}
                    icon={"/icons/whiteboard.svg"}
                    iconAlt={"whiteboard"}
                >
                    {i18n.t("Classrooms")}
                </SidebarLink>

                <SidebarLink
                    href={`/institutions/${institution?.id}/chat`}
                    icon={"/icons/chat.svg"}
                    iconAlt={"chat"}
                >
                    {i18n.t("Chat")}
                </SidebarLink>

                {role === "ADMIN" && (
                    <SidebarLink
                        href={`/institutions/${institution?.id}/billing`}
                        icon={"/icons/billing.svg"}
                        iconAlt={"billing"}
                    >
                        {i18n.t("Billing")}
                    </SidebarLink>
                )}

                {role === "ADMIN" && (
                    <SidebarLink
                        href={`/institutions/${institution?.id}/settings`}
                        icon={"/icons/settings.svg"}
                        iconAlt={"settings"}
                    >
                        {i18n.t("Settings")}
                    </SidebarLink>
                )}
            </div>

            <InstitutionDisplay />
            <UserDisplay />
        </SidebarBase>
    );
}

