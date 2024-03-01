import React, {createContext} from "react";
import {UserInstitutionDto} from "types";

interface UserInstitutionContextProps {
    userInstitutions: UserInstitutionDto[];
    changed: boolean;
    setChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserInstitutionsContext = createContext<
    UserInstitutionContextProps
>({
    userInstitutions: [],
    changed: false,
    setChanged: () => {},
});

export default UserInstitutionsContext;
