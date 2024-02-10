import {InstitutionDto} from "dtos";
import React from "react";
import Link from "next/link";
import {constants} from "@/utils/constants";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

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

    async function create(formData: FormData) {
        "use server";

        const id = formData.get("id")!.toString();
        const institutionResp = await fetch(
            constants.API + "/api/institutions/" + id,
            {
                headers: {
                    Authorization: `Bearer ${cookies().get(constants.TOKEN_STORAGE_KEY)?.value}`
                }
            }
        );
        if (institutionResp.status === 401)
            redirect("/institutions?error=unauthorized");
        if (institutionResp.status !== 200)
            redirect("/institutions?error=notfound");
        cookies().set(constants.INSTITUTION_STORAGE_KEY, id);
        redirect("/dashboard");
    }

    return (
        <form action={create}>
            <input type="hidden" name={"id"} value={institution.id}/>
            <button
                type={"submit"}
                className={
                    "w-[420px] h-[220px] bg-zinc-200 " +
                    "flex justify-center items-center rounded-lg " +
                    "shadow-md transition-all " +
                    "hover:shadow-xl hover:cursor-pointer hover:bg-mid-blue hover:text-white"
                }
            >
                <div className="text-center">
                    <h1 className={"text-xl"}>{institution.name}</h1>
                    <h2>{institution.description?.substring(0, 20)}</h2>
                </div>
            </button>
        </form>
    );
}