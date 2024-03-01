import {InstitutionDto} from "types";
import React from "react";
import Link from "next/link";
import {getLimitedText} from "@/utils/utils";
import i18n from "@/locales/i18n";
import Image from "next/image";

export function Institution({institution, children, href}: {
    institution?: InstitutionDto,
    children?: React.ReactNode,
    href?: string
}) {

    if (!institution)
        return (
            <Link
                className={
                    "w-[420px] h-[220px] bg-white " +
                    "flex justify-center items-center rounded-lg " +
                    "shadow-md transition-all " +
                    "hover:shadow-xl hover:cursor-pointer hover:bg-mid-blue hover:text-white"
                }
                href={href!}
            >
                {children}
            </Link>
        );
    return (
        <Link
            type={"submit"}
            className={
                "w-[420px] h-[220px] bg-white px-8 group " +
                "flex justify-center items-center rounded-lg " +
                "shadow-md transition-all " +
                "hover:shadow-xl hover:cursor-pointer hover:bg-mid-blue hover:text-white"
            }
            href={"/institutions/" + institution.id}
        >
            <div className="flex flex-wrap gap-8 justify-center items-center">
                <Image
                    src={"/icons/institution.svg"}
                    alt={i18n.t("Institution icon")}
                    width={50} height={50}
                    className={"group-hover:invert transition-all"}
                />
                <div className="text-center overflow-hidden">
                    <h1 className={"text-xl text-wrap"}>{getLimitedText(institution.name)}</h1>
                    <h2>{getLimitedText(institution.name)}</h2>
                </div>
            </div>
        </Link>
    );
}