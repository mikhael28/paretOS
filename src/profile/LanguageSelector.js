import { useState, useContext } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import { MdAutorenew } from "react-icons/md";
import LanguageContext from "../LanguageContext";
import { availableLanguages, updateLanguage } from "../libs/languages";

const LanguageSelector = (props) => {
  const { language, setLanguage } = useContext(LanguageContext);
  let [isLoading, setIsLoading] = useState(false);

  const handleSetIsLoading = (bool) => {
    setIsLoading(bool);
  };

  const handleSetLanguage = (language) => {
    setLanguage(language);
  };

  const handleChange = (e) => {
    updateLanguage({
      language: availableLanguages.find((x) => x.code === e.target.value),
      id: props.id,
      setLanguage: handleSetLanguage,
      setIsLoading: handleSetIsLoading,
    });
  };
  return (
    <div>
      {/* Here we are updating our default language */}

      <FormGroup controlId="defaultLanguage" bsSize="large">
        <ControlLabel>Default Language</ControlLabel>
        <div className="flex">
          {isLoading ? (
            <>
              <FormControl
                name="newLanguage"
                componentClass="select"
                onChange={handleChange}
              >
                <option value="">
                  Please wait - saving language preferences.
                </option>
              </FormControl>
              <MdAutorenew
                style={{ margin: 8, height: "100%" }}
                className="loading-icon spinning"
              />
            </>
          ) : (
            <FormControl
              name="newLanguage"
              componentClass="select"
              onChange={handleChange}
              defaultValue={language.code}
              value={language.code}
            >
              {availableLanguages.map(({ code, name }) =>
                code === language.code ? (
                  <option key={code} value={code} selected>
                    {name}
                  </option>
                ) : (
                  <option key={code} value={code}>
                    {name}
                  </option>
                )
              )}
            </FormControl>
          )}
        </div>
      </FormGroup>
    </div>
  );
};
export default LanguageSelector;
