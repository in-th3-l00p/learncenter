import {UserDto} from "types";
import Cookie from "js-cookie";
import {constants} from "@/utils/constants";
import {cookies} from "next/headers";

export interface UserProps {
    user?: UserDto;
}

export default async function getAuthenticated(): Promise<UserDto | undefined> {
    const token = cookies().get("token");
    if (!token)
        return undefined;
    const response = await fetch(`${constants.API}/api/auth`, {
        headers: {
            "Authorization": `Bearer ${token.value}`
        },
        cache: "no-cache"
    });

    if (response.ok) {
        return await response.json();
    } else {
        Cookie.remove("token");
        return undefined;
    }
}