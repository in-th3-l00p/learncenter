"use server";

import {constants} from "@/utils/constants";
import {InstitutionDto} from "dtos";
import {cookies} from "next/headers";
import React from "react";
import getAuthenticated from "@/utils/getAuthenticated";
import {redirect} from "next/navigation";
import {Institution} from "@/app/institutions/institution";

export default async function Institutions() {
    const user = await getAuthenticated();
    if (!user)
        redirect("/login");

    const institutionsResp = await fetch(constants.API + "/api/institutions", {
        headers: {
            "Authorization": `Bearer ${cookies().get(constants.TOKEN_STORAGE_KEY)?.value}`
        }
    });
    const institutions: InstitutionDto[] = await institutionsResp.json();

    return (
        <section className={"p-8"}>
            <h1 className={"text-4xl bold mb-4"}>Institutions</h1>
            <h2 className={"text-xl mb-8"}>Select an institution, or create one</h2>

            <div className={"flex flex-wrap gap-8"}>
                {institutions.map((institution, index) => (
                    <Institution
                        key={index}
                        institution={institution}
                    />
                ))}
                <Institution href={"/institutions/create"}>
                    <span className={"text-6xl"}>+</span>
                </Institution>
            </div>
        </section>
    );
}