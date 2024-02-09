"use client";

import Loading from "@/components/Loading";
import {useEffect} from "react";
import Cookie from "js-cookie";
import {constants} from "@/utils/constants";

export default function Logout() {
    useEffect(() => {
        Cookie.remove(constants.TOKEN_STORAGE_KEY);
        window.location.href = "/";
    }, []);

    return (
        <Loading />
    );
}