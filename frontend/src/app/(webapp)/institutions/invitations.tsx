import i18n from "@/locales/i18n";
import React from "react";
import {constants} from "@/utils/constants";
import {cookies} from "next/headers";
import {InstitutionInvite} from "@/app/(webapp)/institutions/institutionInvite";
import {UserInstitutionDto} from "types/src/dtos";

export default async function InstitutionsInvitations() {
    const invitationsResp = await fetch(
        `${constants.API}/api/institutions/users?role=PENDING`,
        {
            headers: {
                "Authorization": "Bearer " + cookies().get(constants.TOKEN_STORAGE_KEY)?.value
            }
        }
    );
    const invitations: UserInstitutionDto[] = await invitationsResp.json();

    return (
        <section className="p-8">
            <h1 className={"text-4xl bold mb-4"}>{i18n.t("Invitations")}</h1>
            <h2 className={"text-xl mb-8"}>{i18n.t("Pending invitations on institutions")}</h2>

            <div className="max-w-[600px]">
                {invitations.length === 0 && (
                    <p>{i18n.t("You have no pending invitations")}</p>
                )}

                {invitations.map((invitation: UserInstitutionDto, index) => (
                    <InstitutionInvite
                        invitation={invitation}
                        key={index}
                    />
                ))}
            </div>
        </section>
    );
}