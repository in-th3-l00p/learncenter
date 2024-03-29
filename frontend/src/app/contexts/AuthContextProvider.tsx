"use client";

import React from "react";
import useSWR from "swr";
import {constants} from "@/utils/constants";
import AuthContext from "@/app/contexts/AuthContext";
import Cookie from "js-cookie";

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const { data, isLoading } = useSWR(
        `${constants.API}/api/auth`,
            url => fetch(url, {
                headers: {
                    Authorization: `Bearer ${Cookie.get(constants.TOKEN_STORAGE_KEY)}`
                }
            }).then(res => {
                if (!res.ok) {
                    Cookie.remove(constants.TOKEN_STORAGE_KEY);
                    return undefined;
                }
                return res.json();
            })
    );

    return (
        <AuthContext.Provider value={{ user: data, userLoading: isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
