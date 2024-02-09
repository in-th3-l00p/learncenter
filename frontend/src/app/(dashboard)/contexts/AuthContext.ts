import React from "react";
import {UserDto} from "dtos";

interface IAuthContext {
    user?: UserDto;
    loading: boolean;
}

const AuthContext = React.createContext<IAuthContext>({
    user: undefined,
    loading: true
});

export default AuthContext;