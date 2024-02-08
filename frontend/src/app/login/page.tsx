"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
    return (
        <section className={"flex-grow grid gap-16 lg:grid-cols-2 sm:p-8 md:p-16 lg:py-32 lg:px-64"}>
            <form action="" className={"bg-white p-8 rounded-lg shadow-md flex flex-col justify-center"}>
                <h1 className={"text-4xl font-bold text-center mb-8"}>Login</h1>

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
            <div className={"hidden lg:flex flex-col bg-mid-blue rounded-lg justify-center items-center shadow-md"}>
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