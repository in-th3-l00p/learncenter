"use client";

import {useContext, useEffect, useState} from "react";
import InstitutionContext from "@/app/(institution)/institutions/[institutionId]/contexts/InstitutionContext";
import {LoadingPage} from "@/components/Loading";
import {UserInstitutionDto} from "types";
import {constants} from "@/utils/constants";
import Cookie from "js-cookie";
import i18n from "@/locales/i18n";
import {AddButton} from "@/app/(institution)/institutions/[institutionId]/users/addButton";
import {UserDisplay} from "@/app/(institution)/institutions/[institutionId]/users/userDisplay";

export default function Users() {
    const { institution, institutionLoading } = useContext(InstitutionContext);
    const [userInstitutions, setUserInstitutions] = useState<UserInstitutionDto[]>();

    useEffect(() => {
        if (institutionLoading)
            return;
        fetch(
            `${constants.API}/api/institutions/users/${institution?.id}`,
            {
                headers: {
                    "Authorization": `Bearer ${Cookie.get("token")}`
                }
            }
        )
            .then(resp => resp.json())
            .then(setUserInstitutions);
    }, [institutionLoading]);

    if (institutionLoading || userInstitutions === undefined)
        return <LoadingPage />
    return (
        <section className={"p-8 min-h-full h-full"}>
            <div className="mb-8 flex justify-between items-center">
                <h1 className={"text-4xl"}>{i18n.t("Users")}</h1>
                <AddButton />
            </div>


            {userInstitutions.length === 0 ? (
                <div className="h-[60%] w-full flex justify-center items-center">
                    <p className="text-2xl">{i18n.t("There are no users in this institution.")}</p>
                </div>
            ): (
                <div className="flex flex-col gap-8 max-w-[800px]">
                    {userInstitutions.map(userInstitution => (
                        <UserDisplay
                            key={userInstitution.id}
                            userInstitution={userInstitution}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
