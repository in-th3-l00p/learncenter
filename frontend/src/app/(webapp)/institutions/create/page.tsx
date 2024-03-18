"use client";

import {useState} from "react";
import Loading from "@/components/Loading";
import {constants} from "@/utils/constants";
import handleExpressValidatorErrors from "@/utils/handleExpressValidatorErrors";
import Cookie from "js-cookie";
import ErrorMessage from "@/app/components/errorMessage";
import i18n from "@/locales/i18n";
import {InstitutionDto} from "types/src/dtos";

export default function CreateInstitution() {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<boolean>(false);

    if (loading)
        return (
            <section className={"my-8"}>
                <Loading />
            </section>
        )
    return (
        <section className={"flex justify-center"}>
            <form
                className={"max-w-3xl w-full sm:m-4 sm:rounded-lg sm:hover md:m-8 bg-white p-8 shadow-md"}
                onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);

                    const data = new FormData(e.currentTarget);
                    const name = data.get("name");
                    const description = data.get("description");
                    const resp = await fetch(
                        `${constants.API}/api/institutions`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${Cookie.get("token")}`
                            },
                            body: JSON.stringify({ name, description })
                        }
                    );

                    if (resp.status === 400) {
                        setErrors(handleExpressValidatorErrors(await resp.json()));
                        setLoading(false);
                        return;
                    }

                    if (resp.status === 401) {
                        setLoading(false);
                        window.location.href = "/login";
                        return;
                    }

                    if (!resp.ok) {
                        setErrors({ server: "Internal Server Error" });
                        setLoading(false);
                        return;
                    }

                    const institution: InstitutionDto = await resp.json();
                    Cookie.set(constants.INSTITUTION_STORAGE_KEY, institution.id.toString());
                    window.location.href = "/institutions";
                }}
            >
                <h1 className={"text-4xl font-bold text-center mb-8"}>{i18n.t("Create an institution")}</h1>

                <div className={"mb-8"}>
                    <label htmlFor="name">{i18n.t("Name:")}</label>
                    <input
                        type="text" name="name"
                        id="name" className={"input"}
                        required
                    />
                    <ErrorMessage error={i18n.t(errors.name)} />
                </div>

                <div className={"mb-4 pb-8 border-b"}>
                    <label htmlFor="description">{i18n.t("Description:")}</label>
                    <textarea
                        name="description" id="description"
                        className={"input"}
                    />
                    <ErrorMessage error={i18n.t(errors.description)} />
                </div>

                <button
                    type="submit"
                    className="btn block mx-auto"
                >{i18n.t("Create")}</button>
            </form>
        </section>
    );
}