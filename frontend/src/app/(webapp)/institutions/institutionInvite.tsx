"use client";

import {UserInstitutionDto} from "types";
import i18n from "@/locales/i18n";
import React, {useState} from "react";
import {constants} from "@/utils/constants";
import Cookie from "js-cookie";
import {useRouter} from "next/navigation";

export function InstitutionInvite({invitation}: { invitation: UserInstitutionDto }) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <div className={
            "flex items-center gap-4 mb-4" +
            " bg-white p-4 rounded-lg shadow-md" +
            " border-2 border-light-blue" +
            " hover:border-mid-blue hover:shadow-xl transition-all"
        }>
            <p className={"me-auto"}>{invitation.institution!.name}</p>

            <button
                className="btn"
                onClick={() => {
                    setLoading(true);

                    fetch(
                        `${constants.API}/api/institutions/users/accept/${invitation.institutionId}`,
                        {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${Cookie.get(constants.TOKEN_STORAGE_KEY)}`,
                            }
                        })
                        .then(() => {
                            router.refresh();
                        });
                }}
                disabled={loading}
            >
                {i18n.t("Accept")}
            </button>
            <button
                className="danger-btn"
                onClick={() => {
                    setLoading(true);
                }}
                disabled={loading}
            >
                {i18n.t("Reject")}
            </button>
        </div>
    );
}