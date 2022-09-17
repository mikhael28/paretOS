import { useState, useContext } from "react";
import { MdAutorenew } from "react-icons/md";
import LanguageContext, { Language } from "../redux/state/LanguageContext";
import { availableLanguages, updateLanguage } from "../libs/languages";
import {
  FormLabel,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { selectProfile } from "@src/redux/selectors/profile/select-profile";
import { store } from "@src/redux/store";

const LanguageSelector = () => {
  const langContext = useContext(LanguageContext);
  const language = langContext.language as Language;
  const setLanguage = langContext.setLanguage;
  let [isLoading, setIsLoading] = useState(false);

  const handleSetIsLoading = (bool: boolean) => {
    setIsLoading(bool);
  };

  const handleSetLanguage = (language: Language) => {
    setLanguage(language);
  };

  const handleChange = (e: SelectChangeEvent<string>) => {
    const user = selectProfile(store.getState());
    updateLanguage({
      language: availableLanguages.find(
        (x) => x.code === (e.target as HTMLSelectElement).value
      ),
      id: user.id,
      setLanguage: handleSetLanguage,
      setIsLoading: handleSetIsLoading,
    });
  };

  return (
    <div>
      <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
        <FormLabel style={{ fontSize: 18, color: "#fff", fontWeight: 600 }}>
          <h2>Default Language</h2>
        </FormLabel>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Select
              value={"default"}
              defaultValue={"default"}
              style={{
                background: "var(--navigation-bgColor)",
              }}
              fullWidth
              variant="filled"
              disabled
            >
              <MenuItem value="default">
                Please wait - saving language preferences.
              </MenuItem>
            </Select>
            <MdAutorenew
              style={{ margin: 8, height: "100%" }}
              className="loading-icon spinning"
            />
          </div>
        ) : (
          <Select
            value={language?.code || ""}
            defaultValue={language?.code || ""}
            style={{
              background: "var(--navigation-bgColor)",
            }}
            fullWidth
            variant="filled"
            onChange={handleChange}
            disabled={isLoading}
          >
            {availableLanguages.map(({ code, name }) =>
              code === language.code ? (
                <MenuItem key={code} value={code} selected>
                  {name}
                </MenuItem>
              ) : (
                <MenuItem key={code} value={code}>
                  {name}
                </MenuItem>
              )
            )}
          </Select>
        )}
      </FormControl>
    </div>
  );
};
export default LanguageSelector;
