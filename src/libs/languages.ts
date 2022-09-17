import { RestAPI } from "@aws-amplify/api-rest";
import { I18n } from "@aws-amplify/core";

export const availableLanguages = [
  {
    name: "English",
    code: "en",
    image:
      "https://cdn.countryflags.com/thumbs/united-states-of-america/flag-400.png",
  },
  {
    name: "Lugandan",
    code: "lg",
    image: "https://cdn.countryflags.com/thumbs/uganda/flag-square-250.png",
  },
  {
    name: "Spanish",
    code: "es",
    image: "https://cdn.countryflags.com/thumbs/spain/flag-400.png",
  },
  {
    name: "Portugues (BR)",
    code: "ptbr",
    image: "https://cdn.countryflags.com/thumbs/brazil/flag-400.png",
  },
  {
    name: "Nigerian Pidgin",
    code: "ngpg",
    image: "https://cdn.countryflags.com/thumbs/nigeria/flag-400.png",
  },
  {
    name: "Hindi",
    code: "hi",
    image: "https://cdn.countryflags.com/thumbs/india/flag-400.png",
  },
  {
    name: "Acholi",
    code: "ac",
    image: "https://cdn.countryflags.com/thumbs/uganda/flag-square-250.png",
  },
];

export interface UpdateLanguageProps {
  language: any;
  id: string;
  setLanguage: Function;
  setIsLoading?: Function;
}

export async function updateLanguage({
  language,
  id,
  setLanguage,
  setIsLoading,
}: UpdateLanguageProps) {
  if (setIsLoading) {
    setIsLoading(true);
  }
  let body = { defaultLanguage: language.code };
  try {
    await RestAPI.put("pareto", `/users/${id}`, {
      body,
    });
    I18n.setLanguage(language.code);
    setLanguage(language);
  } catch (e) {
    console.error(e);
  }
  if (setIsLoading) {
    setIsLoading(false);
  }
}
