/* eslint-disable react/no-array-index-key */
import Button from "react-bootstrap/lib/Button";

interface Props {
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
}: Props) {
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
              onClick={() =>
                savePlanning(activeSprintId, index, i, dynamicForms[i].content)
              }
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
