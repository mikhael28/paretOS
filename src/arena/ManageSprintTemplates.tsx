import { I18n } from "@aws-amplify/core";
import { Mission, SprintTemplateMongoDBDoc } from "../types/ArenaTypes";
import { BsPencil, BsTrash } from "react-icons/bs";
import { Paper, useTheme } from "@mui/material";

export interface ManageSprintTemplateProps {
  userManageableTemplates: SprintTemplateMongoDBDoc[];
  handleDeleteTemplate: (id: string) => Promise<void>;
  handleEditTemplate: (id: string) => Promise<void>;
}

function ManageSprintTemplates({ userManageableTemplates, handleDeleteTemplate, handleEditTemplate }: ManageSprintTemplateProps) {
  const theme = useTheme();

  return (
    <>
      <h1
        id="manage-templates-heading"
        style={{
          width: "auto",
          marginTop: "3rem",
          marginBottom: "1rem",
          fontWeight: 900,
        }}
      >
        {I18n.get("manageTemplates")}
      </h1>
      <div
        style={{
          width: "auto",
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          margin: theme.spacing(-2)
        }}
      >
        {userManageableTemplates.map((template: SprintTemplateMongoDBDoc) => (
          <Paper
            key={template.title}
            sx={{
              padding: theme.spacing(2),
              margin: theme.spacing(2),
              minWidth: `calc(100% - ${theme.spacing(4)})`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                justifyItems: "space-between",
                flexDirection: "row",
                minWidth: `calc(100% - ${theme.spacing(4)})`,
              }}
              id={template.title}
            >
              <div>
                <h3>{template.title}</h3>
                <span style={{ fontSize: "small" }}>
                  {`${template.missions.length} ${template.missions.length === 1 ? "mission" : "missions"}`}
                  {template.missions.length > 0 && `: ${template.missions.map((mission: Mission) => mission.title).join(", ")}`}
                </span>
              </div>
              <div style={{ minWidth: "55px", display: "flex", flexWrap: "nowrap" }}>
                <div style={{
                    marginLeft: 8,
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                  }}>
                  <BsPencil
                    title="edit template"
                    onClick={() => handleEditTemplate(template.id)}
                    
                  />
                </div>
                <div style={{
                    marginLeft: 8,
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                  }}
                >
                  <BsTrash
                    title="delete template"
                    onClick={() => {
                      handleDeleteTemplate(template.id);
                    }}
                  />
                </div>
              </div>
            </div>

            
          </Paper>
        ))}
      </div>
    </>
  );
}

export default ManageSprintTemplates;
