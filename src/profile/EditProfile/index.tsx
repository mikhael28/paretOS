import { useTheme } from "@mui/material";
import LanguageSelector from "../LanguageSelector";
import { Summary } from "./Summary";
import { Projects } from "./Projects";
import { EditName } from "./EditName";

/**
 * These are the forms where you can edit your profile.
 * @TODO GH Issue #26
 */

const EditProfile = () => {
  return (
    <div className="flex-down">
      <EditName />
      <Summary />

      {/* This is where we are adding projects to your profile */}

      <Projects />
      <br />
      <div style={{ marginLeft: 8, marginRight: 8 }}>
        <LanguageSelector />
      </div>
    </div>
  );
};

export default EditProfile;
