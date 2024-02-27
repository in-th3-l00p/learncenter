import {InstitutionDto} from "types";
import React from "react";
import Link from "next/link";
import {getLimitedText} from "@/utils/utils";

export function Institution({institution, children, href}: {
    institution?: InstitutionDto,
    children?: React.ReactNode,
    href?: string
}) {

    if (!institution)
        return (
            <Link
                className={
                    "w-[420px] h-[220px] bg-zinc-200 " +
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
                "w-[420px] h-[220px] bg-zinc-200 " +
                "flex justify-center items-center rounded-lg " +
                "shadow-md transition-all " +
                "hover:shadow-xl hover:cursor-pointer hover:bg-mid-blue hover:text-white"
            }
            href={"/institutions/" + institution.id}
        >
            <div className="text-center overflow-hidden">
                <h1 className={"text-xl text-wrap"}>{getLimitedText(institution.name)}</h1>
                <h2>{getLimitedText(institution.name)}</h2>
            </div>
        </Link>
    );
}