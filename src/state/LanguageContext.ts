import { createContext } from "react";

export interface LanguageProps {
  language: object | null;
  setLanguage: Function;
}

const emptyLanguageProps: LanguageProps = {
  language: {
    name: "",
    code: "",
    image: "",
  },
  setLanguage: () => {},
};
export const LanguageContext = createContext(emptyLanguageProps);

export default LanguageContext;
