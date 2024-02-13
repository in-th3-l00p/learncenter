import React from "react";

export default function Loading() {
    return (
        <section className={"flex-grow flex flex-col gap-8 justify-center items-center"}>
            <h2 className={"text-4xl"}>Loading...</h2>
            <div
                className={"border-dark-blue p-4 rounded-full border-4 border-l-transparent border-r-transparent animate-spin"}
            />
        </section>
    );
}

export function LoadingPage() {
    return (
        <section className={"w-screen h-screen flex justify-center items-center"}>
            <Loading />
        </section>
    )
}