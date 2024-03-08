import {InstitutionDto} from "types";
import {createContext} from "react";

export type InstitutionRole = "ADMIN" | "USER" | "PENDING" | "BANNED" | "DELETED";

interface IInstitutionContext {
    institution?: InstitutionDto;
    setInstitution: (institution: InstitutionDto) => void;
    institutionLoading: boolean;
    role: InstitutionRole;
}

const InstitutionContext = createContext<IInstitutionContext>({
    institution: undefined,
    setInstitution: () => { },
    institutionLoading: true,
    role: "USER"
});

export default InstitutionContext;
