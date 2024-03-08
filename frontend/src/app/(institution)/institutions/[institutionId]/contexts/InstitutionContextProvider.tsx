"use client";

import React, {useContext, useEffect} from "react";
import {constants} from "@/utils/constants";
import Cookie from "js-cookie";
import InstitutionContext, {InstitutionRole} from "@/app/(institution)/institutions/[institutionId]/contexts/InstitutionContext";
import {InstitutionDto, UserInstitutionDto} from "types";
import {useParams} from "next/navigation";
import {LoadingPage} from "@/components/Loading";
import AuthContext from "@/app/contexts/AuthContext";

export default function InstitutionContextProvider({ children }: { children: React.ReactNode }) {
    const { user } = useContext(AuthContext);
    const { institutionId } = useParams<{ institutionId: string }>();
    const [institution, setInstitution] = React.useState<InstitutionDto>();
    const [role, setRole] = React.useState<InstitutionRole | null>(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        (async () => {
            if (!user)
                return;
            try {
                let resp = await fetch(`${constants.API}/api/institutions/${institutionId}`, {
                    headers: {
                        Authorization: `Bearer ${Cookie.get(constants.TOKEN_STORAGE_KEY)}`
                    }
                });

                if (resp.status !== 200)
                    throw new Error();
                setInstitution(await resp.json());
                resp = await fetch(
                    `${constants.API}/api/institutions/users/${institutionId}?userId=${user?.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${Cookie.get(constants.TOKEN_STORAGE_KEY)}`
                        }
                    });
                if (resp.status !== 200)
                    throw new Error();
                const institutionUser: UserInstitutionDto[] = await resp.json();
                setRole(institutionUser[0].role);
            } catch (e) {
                window.location.href = "/institutions";
                setLoading(false);
            }
        })();
    }, [user]);

    useEffect(() => {
        if (institution && role)
            setLoading(false);
    }, [institution, role]);

    if (loading)
        return (
            <LoadingPage />
        );
    return (
        <InstitutionContext.Provider value={{
            institution,
            setInstitution,
            institutionLoading: loading,
            role: role!,
        }}>
            {children}
        </InstitutionContext.Provider>
    );
}
