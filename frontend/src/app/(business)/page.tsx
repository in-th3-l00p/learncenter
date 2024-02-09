import i18next from "i18next";
import Image from "next/image";
import "./home.css";
import React from "react";
import Link from "next/link";

export default async function Home() {
    return (
        <>
            <section className={"py-32 padding responsive-grid"}>
                <div className={"text-center max-w-xl"}>
                    <h1 className={"text-4xl mb-4"}>
                        Learn
                        <span className={"text-mid-blue font-bold"}>Center</span>
                    </h1>
                    <p className={"text-xl mb-8"}>
                        {i18next.t("introduction")}
                    </p>

                    <div className={"flex justify-center gap-8"}>
                        <Link href={"/about"}>
                            <button type={"submit"} className={"btn"}>{ i18next.t("Learn more") }</button>
                        </Link>
                        <Link href={"/register"}>
                            <button type={"submit"} className={"dark-btn"}>{ i18next.t("Register") }</button>
                        </Link>
                    </div>
                </div>
                <Image
                    src={"/home/mainhero.svg"}
                    alt={""}
                    width={500}
                    height={500}
                    className={"ms-auto"}
                />
            </section>
            <section className={"bg-dark-blue text-white padding responsive-grid py-16"}>
                <div>
                    <h2 className={"text-4xl mb-8"}>{ i18next.t("Embrace technology within education") }</h2>
                    <p className={"text-xl"}>{ i18next.t("explanation") }</p>
                </div>
                <Image
                    src={"/home/screenshot.png"}
                    alt={"screenshot of the app"}
                    width={500}
                    height={500 * 16/9}
                    className={"ms-auto rounded-lg shadow-md"}
                />
            </section>
        </>
    );
}
