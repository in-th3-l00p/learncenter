"use client";

import {useContext, useState} from "react";
import InstitutionContext from "@/app/(institution)/institutions/[institutionId]/contexts/InstitutionContext";
import {constants} from "@/utils/constants";
import Cookie from "js-cookie";
import { LoadingPage } from "@/components/Loading";
import i18n from "@/locales/i18n";

async function saveInstitution(
    id: number,
    name: string,
    description?: string
) {
    const response = await fetch(`${constants.API}/api/institutions/${id}`, {
        method: "PUT",
        headers: {
            authorization: `Bearer ${Cookie.get("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            description: description
        })
    });

    return await response.json();
}

export default function Settings() {
    const { institution, setInstitution, institutionLoading } = useContext(InstitutionContext);
    const [saving, setSaving] = useState(false);

    if (institutionLoading)
        return <LoadingPage />
    return (
        <section className={"p-8"}>
            <h1 className={"text-4xl mb-8"}>{i18n.t("Settings")}</h1>

            <div className="max-w-[800px]">
                <form
                    className={"mb-8 border-b pb-8"}
                    onSubmit={(e) => {
                        e.preventDefault();

                        setSaving(true);
                        const data = new FormData(e.currentTarget);
                        const name = data.get("name") as string;
                        saveInstitution(institution!.id, name, institution?.description!)
                            .then(setInstitution)
                            .finally(() => setSaving(false));
                    }}
                >
                <span className="block mb-4">
                    <label htmlFor="name" className={"text-xl"}>{i18n.t("Institution name:")}</label>
                    <p>{i18n.t("Make sure the name represents your institution")}</p>
                </span>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            defaultValue={institution?.name}
                            id={"name"}
                            name={"name"}
                            className={"input"}
                            required
                        />

                        <button
                            type="submit"
                            className={"btn"}
                            disabled={saving}
                        >
                            {i18n.t("Save")}
                        </button>
                    </div>
                </form>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                        setSaving(true);
                        const data = new FormData(e.currentTarget);
                        const description = data.get("description") as string;
                        saveInstitution(institution!.id, institution?.name!, description)
                            .then(setInstitution)
                            .finally(() => setSaving(false));
                    }}
                >
                <span className="block mb-4">
                    <label htmlFor="description" className={"text-xl"}>{i18n.t("Description")}</label>
                    <p>{i18n.t("Describe your institution's values and objectives")}</p>
                </span>
                    <textarea
                        name="description" id="description"
                        className={"input h-40 resize-none mb-4"}
                        defaultValue={institution?.description}
                    />
                    <button
                        type="submit"
                        className={"btn"}
                        disabled={saving}
                    >
                        {i18n.t("Save")}
                    </button>
                </form>
            </div>
        </section>
    )
}
