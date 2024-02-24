"use client";

import {useContext, useEffect, useState} from "react";
import InstitutionContext from "@/app/(dashboard)/contexts/InstitutionContext";
import {LoadingPage} from "@/components/Loading";
import {UserInstitutionDto} from "types";
import {constants} from "@/utils/constants";
import Cookie from "js-cookie";

function UserDisplay({ userInstitution }: { userInstitution: UserInstitutionDto }) {
    return (
        <div className={
            "flex justify-between items-center" +
            " bg-white p-4 rounded-lg shadow-md" +
            " border-2 border-light-blue" +
            " hover:border-mid-blue hover:shadow-xl transition-all"
        }>
            <div className="flex gap-4 items-center">
                <img
                    src={"/demo/demopfp.jpeg"}
                    alt={"profile"}
                    className="rounded-full aspect-square"
                    width={80}
                    height={80}
                />

                <div>
                    <h2>{userInstitution.user.firstName + " " + userInstitution.user.lastName}</h2>
                    <p>Role: {userInstitution.role}</p>
                </div>
            </div>
            <div>
                <button
                    className="btn"
                    title={"settings"}
                >
                    <img
                        src="/icons/settings.svg" alt="settings"
                        className={"invert"}
                        width={30} height={30}
                    />
                </button>
            </div>
        </div>
    );
}

export default function Users() {
    const { institution, setInstitution, institutionLoading } = useContext(InstitutionContext);
    const [userInstitutions, setUserInstitutions] = useState<UserInstitutionDto[]>();
    const [saving, setSaving] = useState(false);

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
                <h1 className={"text-4xl"}>Users</h1>
                <button
                    className={"btn"}
                    title={"Add user"}
                >
                    <img
                        src="/icons/add.svg" alt="add"
                        className={"invert"}
                        width={30} height={30}
                    />
                </button>
            </div>


            {userInstitutions.length === 0 ? (
                <div className="h-[60%] w-full flex justify-center items-center">
                    <p className="text-2xl">There are no users in this institution.</p>
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
