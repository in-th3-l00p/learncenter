import {InstitutionDto} from "../../../../../shared/types";
import {createContext} from "react";

interface IInstitutionContext {
    institution?: InstitutionDto;
    setInstitution: (institution: InstitutionDto) => void;
    institutionLoading: boolean;
}

const InstitutionContext = createContext<IInstitutionContext>({
    institution: undefined,
    setInstitution: () => { },
    institutionLoading: true
});

export default InstitutionContext;
