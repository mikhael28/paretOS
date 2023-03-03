import React, { useEffect, useState, useContext, SetStateAction } from "react";
import { useTheme, Button, FormLabel } from "@mui/material";
import { ToastMsgContext } from "../state/ToastContext";
import TextField from "@mui/material/TextField";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { I18n } from "@aws-amplify/core";
import { useNavigate } from "react-router-dom";
import ManageSprintTemplates from "./ManageSprintTemplates";
import { Mission, SprintTemplateMongoDBDoc, SprintTemplatePostBody } from "../types/ArenaTypes";
import { deleteSprintTemplate } from "../utils/queries/sprintTemplateQueries";
import { User } from "../types/ProfileTypes";

/**
 *
 * This function handles the logic for handling which column owns a dragged item.
 * @TODO This page needs a few improvements.
 */

export interface CreateSprintTemplateProps {
  user: User;
  navigate: typeof useNavigate;
  getTemplates: () => Promise<SprintTemplateMongoDBDoc[]>;
  setTemplate: (body: object) => Promise<void>;
  getTemplateOptionsFromSanity: () => Promise<object>;
  updateTemplate: (id: string, body: object) => Promise<SprintTemplateMongoDBDoc>;
  deleteTemplate: (id: string) => Promise<SprintTemplateMongoDBDoc>;
}

interface OnDragEndParams {
  result: DropResult;
  columns: {
    [x: string]: any;
    Options?: { name: string; items: Mission[] };
    Morning?: { name: string; items: Mission[] };
    Workday?: { name: string; items: Mission[] };
    Evening?: { name: string; items: Mission[] };
  };
  setColumns: {
    (
      value: React.SetStateAction<{
        Options: { name: string; items: Mission[] };
        Morning: { name: string; items: Mission[] };
        Workday: { name: string; items: Mission[] };
        Evening: { name: string; items: Mission[] };
      }>
    ): void;
    (arg0: any): void;
  };
}

const onDragEnd = ({ result, columns, setColumns }: OnDragEndParams) => {
  if (!result.destination) {
    return;
  }
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function CreateSprintTemplate(props: CreateSprintTemplateProps) {
  const { handleShowError, handleShowSuccess } = useContext(ToastMsgContext);

  const theme = useTheme();

  const [columns, setColumns] = useState({
    Options: {
      name: "Options",
      items: [] as Mission[],
    },
    Morning: {
      name: "Morning",
      items: [] as Mission[],
    },
    Workday: {
      name: "Workday",
      items: [] as Mission[],
    },
    Evening: {
      name: "Evening",
      items: [] as Mission[],
    },
  });
  const [title, setTitle] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(-1);
  const [existingTemplates, setExistingTemplates] = useState([] as string[]);
  const [userManageableTemplates, setUserManageableTemplates] = useState([] as SprintTemplateMongoDBDoc[]);
  const [error, setError] = useState("");

  function generateMissionsArray() {
    let missionsArray: Mission[] = [];

    columns.Morning.items.forEach((item) => {
      missionsArray.push(item);
    });
    columns.Workday.items.forEach((item) => {
      missionsArray.push(item);
    });
    columns.Evening.items.forEach((item) => {
      missionsArray.push(item);
    });
    return missionsArray;
  }

  function resetTitleAndColumns() {
    setTitle("");
    setColumns({
      Options: {
        name: "Options",
        items: [
          ...columns.Options.items,
          ...columns.Morning.items,
          ...columns.Workday.items,
          ...columns.Evening.items
        ]
      },
      Morning: {
        name: "Morning",
        items: []
      },
      Workday: {
        name: "Workday",
        items: []
      },
      Evening: {
        name: "Evening",
        items: []
      }
    })
  }

  async function createTemplate() {
    let body = {
      id: nanoid(),
      title: title,
      author: `${props.user.fName} ${props.user.lName}`,
      authorId: props.user.id,
      version: "1.0",
      missions: generateMissionsArray(),
      league: "Pareto Athletic Association (PAA)",
      admin: {
        name: `${props.user.fName} ${props.user.lName}`,
        adminId: props.user.id,
      },
      createdAt: Date.now(),
    };
    try {
      await props.setTemplate(body);
      resetTitleAndColumns();
      handleShowSuccess(`Your template "${body.title}" has been successfully created. Scroll down to manage your existing templates.`);
      await getConfiguration();
    } catch (e) {
      handleShowError(e as Error);
    }
  }

  useEffect(() => {
    props.getTemplateOptionsFromSanity().then((res) => {
      if (editMode == false) {
        setColumns(
          res as SetStateAction<{
            Options: { name: string; items: Mission[] };
            Morning: { name: string; items: Mission[] };
            Workday: { name: string; items: Mission[] };
            Evening: { name: string; items: Mission[] };
          }>
        )
      } else {
        sortOptionsIntoColumns(activeTemplate).then((res) => setColumns(res));
      }
    });
  }, []);

  useEffect(() => {
    getConfiguration();
  }, []);

  // pulls the /templates api and sets the existing templates
  async function getConfiguration() {
    const templates = await props.getTemplates();
    let templateTitles: string[] = [];
    let userAuthorOrAdminTemplates: SprintTemplateMongoDBDoc[] = [];
    templates.forEach(
      (template: SprintTemplateMongoDBDoc) => {
        templateTitles.push(template.title);
        if (template.authorId === props.user.id || template.admin.adminId === props.user.id) {
          userAuthorOrAdminTemplates.push(template);
        }
      }
    );
    setExistingTemplates(templateTitles);
    setUserManageableTemplates(userAuthorOrAdminTemplates);
  }
  // This will equal true or false, not a number
  const meetsMinimumOptionsThreshold =
    columns.Morning.items.length +
      columns.Workday.items.length +
      columns.Evening.items.length >=
    3;
  
  async function sortOptionsIntoColumns(index: number) {
      const optionColumns = {
        Options: { name: "Options", items: [] as Mission[] },
        Morning: { name: "Morning", items: [] as Mission[] },
        Workday: { name: "Workday", items: [] as Mission[] },
        Evening: { name: "Evening", items: [] as Mission[]},
      }
      const activeTemplateMissionIdsHash = Object.fromEntries(
        userManageableTemplates[index].missions.map(mission => [mission._id, true])
      )
      await props.getTemplateOptionsFromSanity().then((res) => {
        (res as {
          Options: { name: string; items: Mission[] };
          Morning: { name: string; items: Mission[] };
          Workday: { name: string; items: Mission[] };
          Evening: { name: string; items: Mission[] };
        }).Options.items.forEach((item) => {
          if (item._id in activeTemplateMissionIdsHash) {
            // For now, for convenience, just assign all used options to Morning column
            // TODO: Add logic to sprint template distinguishing what time of day is the goal to accomplish the mission
            optionColumns.Morning.items.push(item)
          } else {
            optionColumns.Options.items.push(item)
          }
        })
      })
      return optionColumns
    }
  
  const handleEditTemplate = async (templateId: string) => {
    setEditMode(true);
    const templateIndex = userManageableTemplates.findIndex(template => template.id == templateId)
    setActiveTemplate(templateIndex);
    setTitle(userManageableTemplates[templateIndex].title);

    const sortedColumns = await sortOptionsIntoColumns(templateIndex);
    setColumns(sortedColumns)
  }

  const updateTemplate = async (id: string) => {
    const currentTemplate = userManageableTemplates[activeTemplate];
    let body = {
      title: title,
      version: `${parseInt(currentTemplate.version) + 1.0}`,
      missions: generateMissionsArray(),
    };
    try {
      const updatedTemplate = await props.updateTemplate(id, body);
      userManageableTemplates[activeTemplate] = updatedTemplate;
      setEditMode(false);
      setActiveTemplate(-1);
      resetTitleAndColumns();
      handleShowSuccess(`Sprint Template "${body.title}" has been successfully updated with your changes.`);
    } catch (e) {
      handleShowError(e as Error);
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    const response = await deleteSprintTemplate(id);
    handleShowSuccess(`Sprint Template "${response.title}" has been successfully deleted!`);
    await getConfiguration();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = () => {
    const templates = existingTemplates.filter(
      (template) => template === title.trim()
    );
    let message;
    if (
      title === "" &&
      columns.Morning.items.length === 0 &&
      columns.Workday.items.length === 0 &&
      columns.Evening.items.length === 0
    ) {
      message = "";
    } else if (title.length < 4) {
      message = "Name should be four characters or more.";
    } else if (templates.length > 0) {
      message = "This name is already taken";
    } else if (meetsMinimumOptionsThreshold === false) {
      message = "Add at least 3 Options.";
    } else {
      message = "";
    }
    setError(message);
  };

  useEffect(() => {
    handleChange();
  }, [title, columns, handleChange]);


  const shouldCreateSprint = () => (title !== "" && meetsMinimumOptionsThreshold && !error);
  const shouldUpdateSprint = () => {
    const existingMissionsInSprint: Record<string, boolean> = {};
    userManageableTemplates[activeTemplate].missions.forEach((mission) => existingMissionsInSprint[mission._id] = true);
    const currentAndEditedSprintMissionsAreIdentical = () => {
      return generateMissionsArray().every(mission => mission._id in existingMissionsInSprint) && generateMissionsArray().length == Object.keys(existingMissionsInSprint).length;
    }
    return meetsMinimumOptionsThreshold && title !== "" && title !== userManageableTemplates[activeTemplate].title || !currentAndEditedSprintMissionsAreIdentical();
  }
  

  return (
    <>
      <h1
        id="create-template-heading"
        style={{
          width: "auto",
          marginBottom: "3rem",
          fontWeight: 900,
        }}
      >
        {editMode === false ? I18n.get("createTemplate") : I18n.get("editTemplate")}
      </h1>
      <div
        style={{
          width: "auto",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <FormLabel sx={{ margin: "auto 25px auto 0px" }}>
          {editMode ? I18n.get("enterNewTemplateName"): I18n.get("enterTemplateName")}
        </FormLabel>
        <TextField
          id="template-name"
          color="success"
          error={!editMode ? !!error : false}
          required
          helperText={!editMode ? error : null}
          fullWidth
          label={I18n.get("templateName")}
          variant="outlined"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          sx={{ width: "300px", minWidth: "300px", margin: "auto 0px" }}
        />
        <Button
          disabled={
            (editMode ? !shouldUpdateSprint() : !shouldCreateSprint())
          }
          id="create-template-button"
          fullWidth
          size="large"
          variant="gradient"
          sx={{
            height: "3.8rem",
            margin: "auto 0px auto 30px",
            maxWidth: "280px",
          }}
          onClick={() => editMode === false ? createTemplate() : updateTemplate(userManageableTemplates[activeTemplate].id)}
        >
          {editMode === false ? I18n.get("create") : I18n.get("updateTemplate")}
        </Button>

      </div>
      <div style={{ alignContent: "right", width: "100%", display: "flex" }}>
        {editMode && (
          <Button
            id="cancel-edit-template-button"
            size="medium"
            sx={{
              margin: "auto 0px auto auto",
              maxWidth: "280px",
            }}
            onClick={() => {
              setEditMode(false);
              setTitle("");
            }}
          >
            {I18n.get("cancel")}
          </Button>
        )}
      </div>
      <h2
        style={{
          marginTop: 50,
          textDecoration: "underline",
          fontWeight: 400,
        }}
      >
        {I18n.get("dailyAchievements")}
      </h2>
      <p
        style={{
          textAlign: "left",
          width: "100%",
        }}
      >
        {I18n.get("dragDropDescription")}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          height: "100%",
          overflow: "auto",
          marginTop: "4rem",
        }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd({ result, columns, setColumns })}
        >
          {Object.entries(columns).map(([id, column]) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              // hack to remove console warning, fix later
              key={Math.random()}
            >
              <h2>{column.name}</h2>
              <div
                style={{ margin: 0, overflow: "hidden auto" }}
                className="overflow"
              >
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => (
                    <div
                      id={id}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: snapshot.isDraggingOver
                          ? theme.palette.grey[800]
                          : theme.palette.background.paper,
                        padding: 4,
                        width: 250,
                        minHeight: 600,
                        maxHeight: 600,
                        overflowY: "scroll",
                      }}
                    >
                      {column.items.map((item: any, index: number) => (
                        <Draggable
                          key={item._id}
                          draggableId={item._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              id={item._id}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: "none",
                                padding: 16,
                                margin: "0 0 8px 0",
                                minHeight: 50,
                                backgroundColor: snapshot.isDragging
                                  ? theme.palette.primary.main
                                  : theme.palette.secondary.main,
                                color: "white",
                                ...provided.draggableProps.style,
                              }}
                            >
                              <p id={item.title}>
                                <strong>{item.title}</strong> <span style={{fontSize: "small"}}><br/>{item.xp || 100}XP </span>
                              </p>
                              <p></p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </DragDropContext>
      </div>
      {userManageableTemplates.length > 0 ? (
        <ManageSprintTemplates
          handleDeleteTemplate={handleDeleteTemplate}
          userManageableTemplates={userManageableTemplates}
          handleEditTemplate={handleEditTemplate}
        />
      ) : null}
    </>
  );
}

export default CreateSprintTemplate;
