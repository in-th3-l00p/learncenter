"use server";

import React from "react";
import getAuthenticated from "@/utils/getAuthenticated";
import {redirect} from "next/navigation";
import InstitutionsDisplay from "@/app/(webapp)/institutions/display";
import InstitutionsInvitations from "@/app/(webapp)/institutions/invitations";

export default async function Institutions() {
    const user = await getAuthenticated();
    if (!user)
        redirect("/login");

    return (
        <div>
            <InstitutionsInvitations />
            <InstitutionsDisplay />
        </div>
    );
}