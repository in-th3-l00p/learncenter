import React from "react";
import {UserDto} from "../../../../../shared/types";

interface IAuthContext {
    user?: UserDto;
    userLoading: boolean;
}

const AuthContext = React.createContext<IAuthContext>({
    user: undefined,
    userLoading: true
});

export default AuthContext;