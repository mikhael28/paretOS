import { useState, useContext, FormEvent } from "react";
import {
  FormControl,
  MenuItem,
  Box,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { MdAutorenew } from "react-icons/md";
import LanguageContext, { Language } from "../../redux/state/LanguageContext";
import { availableLanguages, updateLanguage } from "../../libs/languages";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { selectProfile } from "../../redux/selectors/profile/select-profile";

const LanguageSelector = () => {
  const langContext = useContext(LanguageContext);
  const language = langContext.language as Language;
  const setLanguage = langContext.setLanguage;
  const user = useSelector(selectProfile);
  let [isLoading, setIsLoading] = useState(false);
  const { control } = useForm({ reValidateMode: "onChange" });

  const handleSetIsLoading = (bool: boolean) => {
    setIsLoading(bool);
  };

  const handleSetLanguage = (language: Language) => {
    setLanguage(language);
  };

  const handleChange = (e: SelectChangeEvent) => {
    updateLanguage({
      language: availableLanguages.find(
        (x) => x.code === (e.target as HTMLInputElement).value
      ),
      id: user.id,
      setLanguage: handleSetLanguage,
      setIsLoading: handleSetIsLoading,
    });
  };

  return (
    <Box>
      <h2>Default Language</h2>
      <FormControl fullWidth id="defaultLanguage">
        {isLoading ? (
          <>
            <Controller
              render={({ field }) => (
                <Select
                  {...field}
                  id="newLanguage"
                  variant="filled"
                  value=""
                  defaultValue=""
                  onChange={handleChange}
                ></Select>
              )}
              name="Select"
              control={control}
            />

            <MenuItem value="">
              <MdAutorenew
                style={{ margin: 8, height: "100%" }}
                className="loading-icon spinning"
              />
              Please wait - saving language preferences.
            </MenuItem>
          </>
        ) : (
          <Controller
            render={({ field }) => (
              <Select
                {...field}
                id="defaultLanguage"
                variant="filled"
                onChange={handleChange}
                defaultValue={language?.code || ""}
                value={language.code || ""}
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
            name="Select"
            control={control}
          />
        )}
      </FormControl>
    </Box>
  );
};
export default LanguageSelector;
