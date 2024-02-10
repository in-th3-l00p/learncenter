"use client";

import React from "react";
import useSWR from "swr";
import {constants} from "@/utils/constants";
import Cookie from "js-cookie";
import InstitutionContext from "@/app/(dashboard)/contexts/InstitutionContext";

export default function InstitutionContextProvider({ children }: { children: React.ReactNode }) {
    const { data, isLoading } = useSWR(
        `${constants.API}/api/institutions/${Cookie.get(constants.INSTITUTION_STORAGE_KEY)!}`,
        url => fetch(url, {
            headers: {
                Authorization: `Bearer ${Cookie.get(constants.TOKEN_STORAGE_KEY)}`
            }
        }).then(res => res.json())
    );

    return (
        <InstitutionContext.Provider value={{ institution: data, institutionLoading: isLoading }}>
            {children}
        </InstitutionContext.Provider>
    );
}
