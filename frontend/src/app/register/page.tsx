"use client";

import {useState} from "react";
import Loading from "@/components/Loading";
import handleExpressValidatorErrors from "@/utils/handleExpressValidatorErrors";
import {useRouter} from "next/navigation";
import {constants} from "@/utils/constants";

function ErrorMessage({ error }: { error?: string }) {
    if (!error)
        return <></>
    return <p className={"text-red-600 mt-2"}>{ error }</p>
}

export default function Register() {
    const cached = JSON.parse(localStorage.getItem("registerData") || "{}");
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    console.log(errors);

    if (loading)
        return <Loading />
    return (
        <section className={"flex justify-center"}>
            <form
                className={"max-w-3xl w-full sm:m-4 sm:rounded-lg sm:hover md:m-8 bg-white p-8 shadow-md"}
                onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    const data = new FormData(e.currentTarget);
                    const firstName = data.get("firstName");
                    const lastName = data.get("lastName");
                    const username = data.get("username");
                    const email = data.get("email");
                    const phone = data.get("phone");
                    const password = data.get("password");
                    const passwordConfirmed = data.get("passwordConfirmed");

                    localStorage.setItem("registerData", JSON.stringify({
                        firstName, lastName, username, email, phone
                    }));

                    if (password !== passwordConfirmed) {
                        setErrors({ password: "Passwords do not match" });
                        setLoading(false);
                        return;
                    }

                    const res = await fetch(
                        constants.API + "/api/auth/register",
                        {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({firstName, lastName, username, email, phone, password})
                        });
                    if (res.status === 400) {
                        setErrors(handleExpressValidatorErrors(await res.json()));
                        setLoading(false);
                        return;
                    }

                    if (res.status !== 200) {
                        setErrors({ server: "Internal Server Error" });
                        setLoading(false);
                        return;
                    }

                    await router.push("/login?registered");
                }}
            >
                <h1 className={"text-4xl font-bold text-center mb-8"}>Register</h1>

                <div className="w-full grid sm:grid-cols-2 gap-8 mb-8">
                    <div>
                        <label htmlFor="firstName">First name:</label>
                        <input
                            type="text" className={"input"}
                            name={"firstName"} id={"firstName"}
                            required
                            defaultValue={cached.firstName || ""}
                        />
                        <ErrorMessage error={errors["firstName"]} />
                    </div>

                    <div>
                        <label htmlFor="lastName">Last name:</label>
                        <input
                            type="text" className={"input"}
                            name={"lastName"} id={"lastName"}
                            required
                            defaultValue={cached.lastName || ""}
                        />
                        <ErrorMessage error={errors["lastName"]} />
                    </div>
                </div>

                <div className={"mb-8"}>
                    <label htmlFor="phone">Phone number:</label>
                    <input
                        type="tel" name="phone"
                        id="phone" className={"input"}
                        required
                        defaultValue={cached.phone || ""}
                    />
                    <ErrorMessage error={errors["phone"]} />
                </div>

                <div className={"mb-4 pb-8 border-b"}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text" name="username"
                        id="username" className={"input"}
                        required
                        defaultValue={cached.username || ""}
                    />
                    <ErrorMessage error={errors["username"]} />
                </div>

                <div className={"mb-8"}>
                    <label htmlFor="email">Email address:</label>
                    <input
                        type="email" name="email"
                        id="email" className={"input"}
                        required
                        defaultValue={cached.email || ""}
                    />
                    <ErrorMessage error={errors["email"]} />
                </div>

                <div className={"mb-8"}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password" name="password"
                        id="password" className={"input"}
                        required
                    />
                    <ErrorMessage error={errors["password"]} />
                </div>

                <div className={"pb-8 mb-8 border-b"}>
                    <label htmlFor="passwordConfirmed">Confirm password:</label>
                    <input
                        type="password" name="passwordConfirmed"
                        id="passwordConfirmed" className={"input"}
                        required
                    />
                    <ErrorMessage error={errors["passwordConfirmed"]} />
                </div>

                <button type="submit" className="btn block mx-auto">Register</button>
            </form>
        </section>
    );
}