import API from "@aws-amplify/api";
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

export async function updateLanguage({
  language,
  id,
  setLanguage,
  setIsLoading,
}) {
  if (setIsLoading) {
    setIsLoading(true);
  }
  let body = { defaultLanguage: language.code };
  try {
    I18n.setLanguage(language.code);
    setLanguage(language);
    await API.put("pareto", `/users/${id}`, {
      body,
    });
  } catch (e) {
    console.error(e);
  }
  if (setIsLoading) {
    setIsLoading(false);
  }
}
