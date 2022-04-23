import { createContext } from "react";

const LanguageContext = createContext({
  language: {
    name: "",
    code: "",
    image: "",
  },
  setLanguage: () => {},
});

export default LanguageContext;
