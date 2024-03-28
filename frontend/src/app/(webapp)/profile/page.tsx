"use client";

import Image from "next/image";
import i18n from "@/locales/i18n";
import React, {useContext, useState} from "react";
import AuthContext from "@/app/contexts/AuthContext";
import {LoadingPage} from "@/components/Loading";
import ErrorMessage from "@/app/components/errorMessage";
import {constants} from "@/utils/constants";
import Cookie from "js-cookie";
import {useRouter} from "next/navigation";
import handleExpressValidatorErrors from "@/utils/handleExpressValidatorErrors";
import * as Icon from "react-feather";

export default function Profile() {
    const router = useRouter();
    const { user }  = useContext(AuthContext);
    const [updateErrors, setUpdateErrors] = useState<Record<string, string>>({});
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);

    if (!user)
        return <LoadingPage />
    return (
        <section className="py-16 px-4 sm:px-8 md:px-16 lg:px-32">
            <div className="pb-8 border-b-2 border-b-light-blue mb-8 flex flex-wrap gap-16">
                <Image
                    src={"/demo/demopfp.jpeg"}
                    alt={"pfp"}
                    width={256}
                    height={256}
                    className={"aspect-square object-cover rounded-full shadow-md"}
                />

                <div>
                    <h2 className={"text-2xl bold mb-4"}>{user?.username}</h2>
                    <h3>{user?.firstName + " " + user?.lastName}</h3>
                    <h3>{i18n.t("Email")}: {user?.email}</h3>
                    <h3>{i18n.t("Phone number")}: {user?.phone}</h3>
                    <h3>{i18n.t("Created at")}: {new Date(user?.createdAt!).toDateString()}</h3>
                </div>
            </div>

            <div className={"pb-8 mb-8 border-b-2 border-b-light-blue"}>
                <h2 className={"text-2xl mb-8"}>{ i18n.t("Edit profile information") }</h2>

                <form
                    className={"max-w-3xl w-full"}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const resp = await fetch(`${constants.API}/api/auth/update`, {
                            method: "PUT",
                            headers: {
                                "Authorization": "Bearer " + Cookie.get("token"),
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                firstName: formData.get("firstName"),
                                lastName: formData.get("lastName"),
                                username: formData.get("username"),
                                phone: formData.get("phone")
                            })
                        });

                        if (!resp.ok) {
                            setUpdateErrors(handleExpressValidatorErrors(await resp.json()));
                            return;
                        }

                        router.push("/profile");
                    }}
                >
                    <div className="w-full grid sm:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label htmlFor="firstName">{i18n.t("First name:")}</label>
                            <input
                                type="text" className={"input"}
                                name={"firstName"} id={"firstName"}
                                required
                                defaultValue={user?.firstName}
                            />
                            <ErrorMessage error={i18n.t(updateErrors["firstName"])} />
                        </div>

                        <div>
                            <label htmlFor="lastName">{i18n.t("Last name:")}</label>
                            <input
                                type="text" className={"input"}
                                name={"lastName"} id={"lastName"}
                                required
                                defaultValue={user?.lastName}
                            />
                            <ErrorMessage error={i18n.t(updateErrors["lastName"])} />
                        </div>
                    </div>

                    <div className={"mb-8"}>
                        <label htmlFor="phone">{i18n.t("Phone number:")}</label>
                        <input
                            type="tel" name="phone"
                            id="phone" className={"input"}
                            required
                            defaultValue={user?.phone}
                        />
                        <ErrorMessage error={i18n.t(updateErrors["phone"])} />
                    </div>

                    <div className={"mb-8"}>
                        <label htmlFor="username">{i18n.t("Username:")}</label>
                        <input
                            type="text" name="username"
                            id="username" className={"input"}
                            required
                            defaultValue={user?.username}
                        />
                        <ErrorMessage error={i18n.t(updateErrors["username"])} />
                    </div>

                    <button
                        type="submit" className="btn"
                    >
                        {i18n.t("Edit")}
                    </button>
                </form>
            </div>

            <div>
                <h2 className={"text-2xl mb-8"}>{ i18n.t("Change password") }</h2>

                {passwordChanged && (
                    <div
                        className={
                            "mb-8 bg-lighter-blue p-4 rounded-lg border-2 border-mid-blue shadow-lg " +
                            "flex flex-wrap justify-between items-center gap-4 max-w-3xl w-full"
                        }
                    >
                        <p className={""}>{i18n.t("Password changed successfully!")}</p>
                        <button
                            type={"button"}
                            onClick={() => setPasswordChanged(false)}
                        >
                            <Icon.X color={"black"} />
                        </button>
                    </div>
                )}

                <form
                    className={"max-w-3xl w-full"}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const resp = await fetch(`${constants.API}/api/auth/password`, {
                            method: "PUT",
                            headers: {
                                "Authorization": "Bearer " + Cookie.get("token"),
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                currentPassword: formData.get("currentPassword"),
                                password: formData.get("password"),
                                passwordConfirmed: formData.get("passwordConfirmed")
                            })
                        });

                        if (!resp.ok) {
                            setPasswordErrors(handleExpressValidatorErrors(await resp.json()));
                            return;
                        }

                        setPasswordChanged(true);
                    }}
                >
                    <div className={"mb-8"}>
                        <label htmlFor="currentPassword">{i18n.t("Current password:")}</label>
                        <input
                            type="password" name="currentPassword"
                            id="currentPassword" className={"input"}
                            required
                        />
                        <ErrorMessage error={i18n.t(passwordErrors["currentPassword"])} />
                    </div>

                    <div className={"mb-8"}>
                        <label htmlFor="password">{i18n.t("Password:")}</label>
                        <input
                            type="password" name="password"
                            id="password" className={"input"}
                            required
                        />
                        <ErrorMessage error={i18n.t(passwordErrors["password"])} />
                    </div>

                    <div className={"mb-8"}>
                        <label htmlFor="passwordConfirmed">{i18n.t("Confirm password:")}</label>
                        <input
                            type="password" name="passwordConfirmed"
                            id="passwordConfirmed" className={"input"}
                            required
                        />
                        <ErrorMessage error={i18n.t(passwordErrors["passwordConfirmed"])} />
                    </div>

                    <button type="submit" className="btn">{i18n.t("Confirm")}</button>
                </form>
            </div>
        </section>
    );
}