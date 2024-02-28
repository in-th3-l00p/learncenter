import React from "react";
import SidebarContainer from "@/app/(institution)/institutions/[institutionId]/SidebarContainer";
import InstitutionContextProvider from "@/app/(institution)/institutions/[institutionId]/contexts/InstitutionContextProvider";
import AuthContextProvider from "@/app/contexts/AuthContextProvider";

export default async function Layout({children }: { children: React.ReactNode }) {
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