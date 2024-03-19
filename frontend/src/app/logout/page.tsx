"use client";

import React, {useEffect} from "react";
import Cookie from "js-cookie";
import {constants} from "@/utils/constants";
import LoadingPage from "@/app/loading";

export default function Logout() {
    useEffect(() => {
        Cookie.remove(constants.TOKEN_STORAGE_KEY);
        window.location.href = "/";
    }, []);

    return (
        <LoadingPage />
    );
}