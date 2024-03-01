import React, {useState} from "react";
import i18n from "@/locales/i18n";
import Image from "next/image";
import {AddUserModal} from "@/app/(institution)/institutions/[institutionId]/users/addUserModal";

export function AddButton({ disabled = false }: {
    disabled?: boolean;
}) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <AddUserModal open={open} setOpen={setOpen} />
            <button
                className={"btn"}
                title={i18n.t("Add user")}
                onClick={() => setOpen(true)}
                disabled={disabled}
            >
                <Image
                    src="/icons/add.svg"
                    alt="add"
                    className={"invert"}
                    width={30} height={30}
                />
            </button>
        </>
    );
}