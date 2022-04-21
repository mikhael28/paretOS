import { I18n } from "@aws-amplify/core";

/**
 * @constant
 */
export const steps = [
  {
    selector: ".first-step-arena",
    content: `${I18n.get("arenaFirst")}`,
  },
  {
    selector: ".second-step-arena",
    content: `${I18n.get("arenaSecond")}`,
  },
  {
    selector: ".third-step-arena",
    content: `${I18n.get("arenaThird")}`,
  },
];

/**
 * This function sends sprint data to the server.
 * @param sprintData data to be sent over to the sprint
 * @param wsSend instance websocket connection
 */
export const updateSprintData = async (
  sprintData: { [key: string]: any },
  wsSend: WebSocket
) => {
  let updatedSprintData = `{"action":"sendmessage", "data":${JSON.stringify(
    sprintData
  )}, "sprintId": "${sprintData.id}"}`;

  wsSend.send(updatedSprintData);
};
