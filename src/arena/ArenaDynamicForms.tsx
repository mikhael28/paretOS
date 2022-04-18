/* eslint-disable react/no-array-index-key */
import { Button, useTheme } from "@mui/material";

interface ArenaDynamicFormProps {
  index: number;
  plannings: any[];
  activeSprintId: number;
  dynamicForms: any[];
  handleDynamicForms: (e: any) => void;
  savePlanning: (
    activeSprintIndex: number,
    teamIndex: number,
    planningIndex: number,
    content: any
  ) => void;
}

/**
 * This component is used to update the planning of a team.
 */
function ArenaDynamicForms({
  index,
  plannings,
  activeSprintId,
  dynamicForms,
  handleDynamicForms,
  savePlanning,
}: ArenaDynamicFormProps) {
  const theme = useTheme();

  return (
    <>
      {plannings.map((form, i) => (
        <div className="input-group" key={i}>
          <h3>{form.name}</h3>
          <div className="flex">
            <textarea
              id={form.code}
              value={dynamicForms[i].content}
              onChange={handleDynamicForms}
              className="planning-forms"
            />
            <Button
              variant="contained"
              onClick={() =>
                savePlanning(activeSprintId, index, i, dynamicForms[i].content)
              }
              sx={{
                padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
                minWidth: "180px",
                fontSize: "1.4rem",
              }}
            >
              Save
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}

export default ArenaDynamicForms;
