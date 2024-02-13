"use client";

import React, {useEffect} from "react";
import {constants} from "@/utils/constants";
import Cookie from "js-cookie";
import InstitutionContext from "@/app/(dashboard)/contexts/InstitutionContext";
import {InstitutionDto} from "dtos";

export default function InstitutionContextProvider({ children }: { children: React.ReactNode }) {
    const [institution, setInstitution] = React.useState<InstitutionDto>();
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        fetch(`${constants.API}/api/institutions/${Cookie.get(constants.INSTITUTION_STORAGE_KEY)!}`, {
            headers: {
                Authorization: `Bearer ${Cookie.get(constants.TOKEN_STORAGE_KEY)}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setInstitution(data);
                setLoading(false);
            });
    }, []);

    return (
        <InstitutionContext.Provider value={{ institution, setInstitution, institutionLoading: loading }}>
            {children}
        </InstitutionContext.Provider>
    );
}
