"use client";

import React from "react";
import Image from "next/image";
import i18n from "@/locales/i18n";

export default function Modal({
    title,
    open,
    setOpen,
    children,
    onClose
}: {
    title: string;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children?: React.ReactNode;
    onClose?: () => void;
}) {
    if (!open)
        return <></>;
    return (
        <div
            className={
                "absolute z-50 top-0 left-0 w-screen h-screen" +
                " bg-black bg-opacity-50 flex justify-center items-center"
            }
            onClick={(e) => {
                if (e.target === e.currentTarget)
                    setOpen(() => {
                        onClose && onClose();
                        return false;
                    });
            }}
        >
            <div
                className={
                    "bg-white p-8 rounded-lg" +
                    " shadow-lg flex flex-col gap-4" +
                    " w-full sm:mx-16 md:mx-32 lg:mx-64 max-w-[700px] overflow-y-auto"
                }
            >
                <div className="flex justify-between items-center gap-8 mb-8">
                    <h2 className={"text-xl"}>{title}</h2>
                    <button
                        onClick={() => setOpen(() => {
                            onClose && onClose();
                            return false;
                        })}
                        className={"danger-btn !p-2 !rounded-full"}
                        title={i18n.t("close")}
                    >
                        <Image
                            src={"/icons/close.svg"}
                            alt={"close"}
                            width={30}
                            height={30}
                            className={"invert"}
                        />
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}