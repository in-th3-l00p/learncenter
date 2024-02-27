"use client";

import React, {useEffect} from "react";
import {constants} from "@/utils/constants";
import Cookie from "js-cookie";
import InstitutionContext from "@/app/(webapp)/institutions/[institutionId]/contexts/InstitutionContext";
import {InstitutionDto} from "types";
import {useParams} from "next/navigation";
import {LoadingPage} from "@/components/Loading";

export default function InstitutionContextProvider({ children }: { children: React.ReactNode }) {
    const { institutionId } = useParams<{ institutionId: string }>();
    const [institution, setInstitution] = React.useState<InstitutionDto>();
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        fetch(`${constants.API}/api/institutions/${institutionId}`, {
            headers: {
                Authorization: `Bearer ${Cookie.get(constants.TOKEN_STORAGE_KEY)}`
            }
        })
            .then(res => {
                if (res.status !== 200)
                    throw new Error();
                return res.json();
            })
            .then(data => {
                setInstitution(data);
                setLoading(false);
            })
            .catch(() => {
                window.location.href = "/institutions";
                setLoading(false);
            });
    }, []);

    if (loading)
        return (
            <LoadingPage />
        );
    return (
        <InstitutionContext.Provider value={{
            institution,
            setInstitution,
            institutionLoading: loading
        }}>
            {children}
        </InstitutionContext.Provider>
    );
}
