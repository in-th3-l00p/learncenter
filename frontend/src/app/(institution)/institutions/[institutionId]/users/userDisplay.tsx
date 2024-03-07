"use client";

import {UserInstitutionDto} from "types";
import i18n from "@/locales/i18n";
import UserModal from "@/app/(institution)/institutions/[institutionId]/users/userModal";
import {useState} from "react";

export function UserDisplay({userInstitution}: { userInstitution: UserInstitutionDto }) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <UserModal
                open={modalOpen}
                setOpen={setModalOpen}
                userInstitution={userInstitution}
            />
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
                        <h2>{userInstitution.user!.firstName + " " + userInstitution.user!.lastName}</h2>
                        <p>{i18n.t("Role")}: {userInstitution.role}</p>
                    </div>
                </div>
                <div>
                    <button
                        className="btn"
                        title={i18n.t("settings")}
                        onClick={() => setModalOpen(true)}
                    >
                        <img
                            src="/icons/settings.svg" alt="settings"
                            className={"invert"}
                            width={30} height={30}
                        />
                    </button>
                </div>
            </div>
        </>
    );
}