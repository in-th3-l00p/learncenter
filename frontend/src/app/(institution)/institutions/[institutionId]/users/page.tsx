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
import UserInstitutionsContext
    from "@/app/(institution)/institutions/[institutionId]/users/contexts/InstitutionUsersContext";

export default function Users() {
    const { institution, role} = useContext(InstitutionContext);
    const [userInstitutions, setUserInstitutions] = useState<UserInstitutionDto[]>();
    const [userInstitutionsLoading, setUserInstitutionsLoading] = useState<boolean>(true);

    useEffect(() => {
        console.log("userInstitutionsLoading", userInstitutionsLoading);
        if (!userInstitutionsLoading)
            return;
        fetch(
            `${constants.API}/api/institutions/users/${institution?.id}`,
            {
                headers: {
                    "Authorization": `Bearer ${Cookie.get("token")}`
                },
                cache: "no-cache"
            }
        )
            .then(resp => resp.json())
            .then(setUserInstitutions)
            .finally(() => setUserInstitutionsLoading(false));
    }, [userInstitutionsLoading]);

    if (userInstitutionsLoading || !userInstitutions)
        return <LoadingPage />
    return (
        <section className={"p-8 min-h-full h-full"}>
            <UserInstitutionsContext.Provider value={{
                userInstitutions,
                changed: userInstitutionsLoading,
                setChanged: setUserInstitutionsLoading,
            }}>
                <div className="mb-8 flex justify-between items-center">
                    <h1 className={"text-4xl"}>{i18n.t("Users")}</h1>
                    {role === "ADMIN" && <AddButton disabled={userInstitutionsLoading} />}
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
            </UserInstitutionsContext.Provider>
        </section>
    );
}
