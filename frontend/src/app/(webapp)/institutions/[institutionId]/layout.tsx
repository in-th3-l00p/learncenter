import React from "react";
import SidebarContainer from "@/app/(webapp)/institutions/[institutionId]/SidebarContainer";
import InstitutionContextProvider from "@/app/(webapp)/institutions/[institutionId]/contexts/InstitutionContextProvider";

export default async function Layout({children }: { children: React.ReactNode }) {
    return (
        <InstitutionContextProvider>
            <SidebarContainer>
                {children}
            </SidebarContainer>
        </InstitutionContextProvider>
    );
}