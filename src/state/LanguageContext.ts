import { createContext } from "react";

export interface LanguageProps {
  language: object | null;
  setLanguage: Function;
}

export interface Language {
  name: string;
  code: string;
  image: string;
}

const emptyLanguageProps: LanguageProps = {
  language: {
    name: "",
    code: "",
    image: "",
  },
  setLanguage: () => { },
};
export const LanguageContext = createContext(emptyLanguageProps);

export default LanguageContext;
