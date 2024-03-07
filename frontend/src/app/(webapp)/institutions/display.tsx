import {constants} from "@/utils/constants";
import {cookies} from "next/headers";
import {InstitutionDto} from "types";
import i18n from "@/locales/i18n";
import {Institution} from "@/app/(webapp)/institutions/institution";
import React from "react";

export default async function InstitutionsDisplay() {
    const institutionsResp = await fetch(constants.API + "/api/institutions", {
        headers: {
            "Authorization": `Bearer ${cookies().get(constants.TOKEN_STORAGE_KEY)?.value}`
        }
    });
    const institutions: InstitutionDto[] = await institutionsResp.json();
    console.log(institutions);

    return (
        <section className={"p-8"}>
            <h1 className={"text-4xl bold mb-4"}>{i18n.t("Institutions")}</h1>
            <h2 className={"text-xl mb-8"}>{i18n.t("Select an institution, or create one")}</h2>

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