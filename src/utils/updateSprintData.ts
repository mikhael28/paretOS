import { WS } from "../libs/websocket";
/**
 * This function sends sprint data to the server.
 * @param sprintData data to be sent over to the sprint
 * @param wsSend instance websocket connection
 */
export const updateSprintData = async (
  sprintData: { [key: string]: any },
  wsSend: WS
) => {
  let updatedSprintData = `{"action":"sendmessage", "data":${JSON.stringify(
    sprintData
  )}, "sprintId": "${sprintData.id}"}`;

  wsSend.send(updatedSprintData);
};