import {InstitutionDto} from "dtos";
import {createContext} from "react";

interface IInstitutionContext {
    institution?: InstitutionDto;
    loading: boolean;
}

const InstitutionContext = createContext<IInstitutionContext>({
    institution: undefined,
    loading: true
});

export default InstitutionContext;
