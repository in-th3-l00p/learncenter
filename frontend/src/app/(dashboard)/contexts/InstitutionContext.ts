import {InstitutionDto} from "dtos";
import {createContext} from "react";

interface IInstitutionContext {
    institution?: InstitutionDto;
    institutionLoading: boolean;
}

const InstitutionContext = createContext<IInstitutionContext>({
    institution: undefined,
    institutionLoading: true
});

export default InstitutionContext;
