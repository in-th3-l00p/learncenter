import React from "react";
import AuthContextProvider from "@/app/(dashboard)/AuthContextProvider";
import getAuthenticated from "@/utils/getAuthenticated";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import {constants} from "@/utils/constants";
import SidebarContainer from "@/app/(dashboard)/SidebarContainer";
import InstitutionContextProvider from "@/app/(dashboard)/InstitutionContextProvider";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await getAuthenticated() ;
    if (user === undefined)
        redirect("/login");

    if (!cookies().has(constants.INSTITUTION_STORAGE_KEY))
        redirect("/institutions");
    if (await fetch(`${constants.API}/api/institutions/${cookies().get(constants.INSTITUTION_STORAGE_KEY)?.value}`, {
        headers: {
            Authorization: `Bearer ${cookies().get(constants.TOKEN_STORAGE_KEY)?.value}`
        }
    }).then(resp => resp.status) !== 200)
        redirect("/institutions");

    return (
        <AuthContextProvider>
            <InstitutionContextProvider>
                <SidebarContainer>
                    {children}
                </SidebarContainer>
            </InstitutionContextProvider>
        </AuthContextProvider>
    );
}