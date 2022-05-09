import React, { useEffect, useState } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import FormControl from "react-bootstrap/lib/FormControl";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import { useTheme, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { RestAPI } from "@aws-amplify/api-rest";
import { I18n } from "@aws-amplify/core";
import sanity from "../libs/sanity";
import { errorToast } from "../libs/toasts";

/**
 *
 * This function handles the logic for handling which column owns a dragged item.
 * @TODO Warning that this page is intended to be used on a desktop.
 * @TODO Loading animation on button while sprint is being created.
 * @TODO Some sort of verification of seriousness - if someone only has one item in the sprint, should I allow it.
 * @TODO Should this be public functionality right now? I'm thinking no, not until it's fleshed out a bit more - but perhaps best to leave it in for now.
 */
const onDragEnd = (result, columns, setColumns) => {
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

function CreateSprintTemplate(props) {
  const theme = useTheme();
  const [columns, setColumns] = useState({
    Options: {
      name: "Options",
      items: [],
    },
    Morning: {
      name: "Morning",
      items: [],
    },
    Workday: {
      name: "Workday",
      items: [],
    },
    Evening: {
      name: "Evening",
      items: [],
    },
  });
  const [title, setTitle] = useState("");
  const [missions, setMissions] = useState([]);

  async function createTemplate() {
    let missionsArray = [];
    columns.Morning.items.map((item) => {
      missionsArray.push(item);
    });
    columns.Workday.items.map((item) => {
      missionsArray.push(item);
    });
    columns.Evening.items.map((item) => {
      missionsArray.push(item);
    });

    let body = {
      id: uuidv4(),
      title: title,
      author: `${props.user.fName} ${props.user.lName}`,
      authorId: props.user.id,
      version: "1.0",
      missions: missionsArray,
      league: "Pareto Athletic Association (PAA)",
      admin: {
        name: `${props.user.fName} ${props.user.lName}`,
        adminId: props.user.id,
      },
      createdAt: Date.now(),
    };
    try {
      await RestAPI.post("pareto", `/templates`, { body });
      props.history.push("/");
    } catch (e) {
      errorToast(e, props.user);
    }
  }

  /**
   * Getting our potential sprint items from Sanity. Will likely need to replace later.
   */
  async function getSanityItems() {
    const query = `*[_type == 'achievement' && !(_id in path("drafts.**"))]`;
    const links = await sanity.fetch(query);
    let initialData = {
      Options: {
        name: `${I18n.get("options")}`,
        items: links,
      },
      Morning: {
        name: `${I18n.get("morning")}`,
        items: [],
      },
      Workday: {
        name: `${I18n.get("workday")}`,
        items: [],
      },
      Evening: {
        name: `${I18n.get("evening")}`,
        items: [],
      },
    };
    setColumns(initialData);
  }

  useEffect(() => {
    getSanityItems();
  }, []);

  useEffect(() => {
    getConfiguration();
  }, []);

  // pulls the /templates api and sets the missions to the templates
  async function getConfiguration() {
    let options = await RestAPI.get("pareto", "/templates");
    setMissions(options.map((option) => option.title));
  }

  // checks to see if minimum template requirements are met
  function checkReqs() {
    let result;
    const templates = missions.filter((mission) => mission === title);
    if (templates.length !== 0) {
      result = true;
    } else if (title.length <= 4 || columns.Options.items.length > 28) {
      result = true;
    } else {
      result = false;
    }
    return result;
  }
  // throws error messages if requirements aren't met
  function reqsErrorMsg() {
    const templates = missions.filter((mission) => mission === title);
    return title.length <= 4
      ? "Name should be four characters or more."
      : columns.Options.items.length > 28
      ? "Add at least 3 Options."
      : templates.length !== 0
      ? "This name is already taken"
      : "";
  }

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          width: "auto",
          marginBottom: "3rem",
          fontWeight: 900,
        }}
      >
        {I18n.get("createTemplate")}
      </h1>
      <FormGroup
        controlId="fName"
        bsSize="large"
        style={{
          width: "auto",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <ControlLabel style={{ marginRight: 25, paddingTop: 10 }}>
          {I18n.get("enterTemplateName")}
        </ControlLabel>
        <TextField
          color="success"
          error={reqsErrorMsg()}
          required
          helperText={reqsErrorMsg()}
          style={{ width: 300 }}
          label={I18n.get("templateName")}
          variant="outlined"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Button
          disabled={checkReqs()}
          variant="gradient"
          onClick={createTemplate}
          style={{ marginLeft: 30, height: "4.8rem" }}
        >
          {I18n.get("create")}
        </Button>
      </FormGroup>
      <h2
        style={{
          textAlign: "center",
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
          width: 600,
          margin: "0 auto",
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
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
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
                style={{ margin: 8, overflow: "hidden auto" }}
                className="overflow"
              >
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: snapshot.isDraggingOver
                          ? theme.palette.grey[800]
                          : theme.palette.background.paper,
                        padding: 4,
                        width: 250,
                        minHeight: 500,
                      }}
                    >
                      {column.items.map((item, index) => (
                        <Draggable
                          key={item._id}
                          draggableId={item._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
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
                              <p>
                                {item.title} - {item.xp}XP
                              </p>
                              <p>{item.type}</p>
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
    </>
  );
}

export default CreateSprintTemplate;
