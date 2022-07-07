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


