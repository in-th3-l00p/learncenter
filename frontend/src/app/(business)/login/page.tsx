"use client";

import React, {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {constants} from "@/utils/constants";
import {useRouter} from "next/navigation";
import Cookie from "js-cookie";

export default function Login() {
    const [error, setError] = useState<boolean>(false);
    const router = useRouter();

    return (
        <section className={"flex-grow grid gap-16 xl:grid-cols-2 sm:p-8 md:p-16 lg:py-32 xl:px-48"}>
            <form
                className={"bg-white p-8 rounded-lg shadow-md flex flex-col justify-center"}
                onSubmit={async (e) => {
                    e.preventDefault();
                    const data = new FormData(e.currentTarget);
                    const email = data.get("email");
                    const password = data.get("password");

                    const login = await fetch(constants.API + "/api/auth/login", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({ email, password })
                    });

                    if (login.status !== 200) {
                        setError(true);
                        return;
                    }

                    // cookie based
                    const body = await login.json();
                    Cookie.set(constants.TOKEN_STORAGE_KEY, body.token);
                    router.push("/dashboard");
                }}
            >
                <h1 className={"text-4xl font-bold text-center mb-8"}>Login</h1>

                {error && (
                    <p className={"text-red-600 mb-4 text-center"}>Email or password are incorrect.</p>
                )}

                <div className={"mb-8"}>
                    <label className={"block"} htmlFor="email">Email:</label>
                    <input type="email" name={"email"} id={"email"} className={"input"} />
                </div>

                <div className={"mb-8"}>
                    <label className={"block"} htmlFor="password">Password:</label>
                    <input type="password" name={"password"} id={"password"} className={"input"} />
                </div>

                <button type="submit" className="btn block mx-auto">Login</button>
            </form>
            <div className={"hidden xl:flex flex-col bg-mid-blue rounded-lg justify-center items-center shadow-md"}>
                <Image
                    src={"/icons/whiteboard.svg"}
                    alt={"whiteboard"}
                    width={300}
                    height={300}
                    style={{ filter: "invert(100%)" }}
                    className={"mb-4"}
                />
                <h2 className={"text-white text-xl"}>
                    If you don't have an account,
                    <Link
                        href={"/register"}
                        className={"font-bold hover:italic hover:underline"}
                    > press here
                    </Link>.
                </h2>
            </div>
        </section>
    );
}