"use client";

import { UserInstitutionDto } from "types";
import Modal, {ModalFooter} from "@/app/components/Modal";
import React from "react";
import Image from "next/image";
import {constants} from "@/utils/constants";
import Cookie from "js-cookie";
import UserInstitutionsContext
    from "@/app/(institution)/institutions/[institutionId]/users/contexts/InstitutionUsersContext";
import i18n from "@/locales/i18n";

function PendingBody({ userInstitution }: {
    userInstitution: UserInstitutionDto
}) {
    return (
        <div>
            <div className={"flex flex-wrap gap-8"}>
                <Image
                    src="/demo/demopfp.jpeg" alt="demo pfp"
                    width={150} height={150}
                    className="rounded-full aspect-square object-cover shadow-md mx-auto"
                />
                <div className={"flex-grow"}>
                    <h2 className={"font-semibold text-lg"}>{userInstitution.user.firstName + " " + userInstitution.user.lastName}</h2>
                    <p>{i18n.t("Username")}: {userInstitution.user.username}</p>
                    <p>{i18n.t("Pending invitation, sent on")}: {new Date(userInstitution.createdAt).toDateString()}</p>
                </div>
            </div>
        </div>
    );
}

function UserDisplay({ userInstitution }: { userInstitution: UserInstitutionDto }) {
    const { setChanged } = React.useContext(UserInstitutionsContext);

    return (
        <div>
            <div className={"flex flex-wrap gap-8"}>
                <Image
                    src="/demo/demopfp.jpeg" alt="demo pfp"
                    width={150} height={150}
                    className="rounded-full aspect-square object-cover shadow-md mx-auto"
                />
                <div className={"flex-grow"}>
                    <h2 className={"font-semibold text-lg"}>{userInstitution.user.firstName + " " + userInstitution.user.lastName}</h2>
                    <p>{i18n.t("Username")}: {userInstitution.user.username}</p>
                    <p>{i18n.t("Member since")}: {new Date(userInstitution.createdAt).toDateString()}</p>
                </div>
            </div>

            <ModalFooter>
                <button
                    type={"button"}
                    className={"danger-btn"}
                    onClick={() => {
                        fetch(`${constants.API}/api/institutions/users/${userInstitution.institutionId}?userId=${userInstitution.user.id}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${Cookie.get("token")}`,
                            },
                        })
                            .then(() => {
                                setChanged(true);
                            });
                    }}
                >
                    {i18n.t("Remove")}
                </button>
            </ModalFooter>
        </div>
    );
}

export default function UserModal({ open, setOpen, userInstitution }: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userInstitution: UserInstitutionDto
}) {
    return (
        <Modal
            title={i18n.t("User") + " \"" + userInstitution.user.username + "\""}
            open={open}
            setOpen={setOpen}
        >
            {userInstitution.role === "PENDING" && (
                <PendingBody userInstitution={userInstitution} />
            )}
            {userInstitution.role === "USER" && (
                <UserDisplay userInstitution={userInstitution} />
            )}
        </Modal>
    );
}