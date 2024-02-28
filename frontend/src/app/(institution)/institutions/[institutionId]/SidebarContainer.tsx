import React from "react";
import Sidebar from "@/app/(institution)/institutions/[institutionId]/Sidebar";

export default function SidebarContainer({children}: {
    children: React.ReactNode
}) {
    return (
        <div className={"w-screen h-screen flex"}>
            <Sidebar/>
            <main
                className={"w-full min-h-screen flex-grow"}
                style={{overflowY: "scroll"}}
            >
                {children}
            </main>
        </div>
    );
}