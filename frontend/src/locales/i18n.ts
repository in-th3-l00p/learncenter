import i18next from "i18next";
import * as enCommon from "./en/common.json";

i18next.init({
    lng: "en",
    ns: ["common"],
    defaultNS: "common",
    initImmediate: false,
    nsSeparator: false,
    keySeparator: false,
    resources: {
        en: {
            common: enCommon
        }
    }
})

export default i18next;