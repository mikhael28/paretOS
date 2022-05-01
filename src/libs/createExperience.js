import { RestAPI } from "@aws-amplify/api-rest";

/**
 * Reusable function to create experience items.
 * @TODO Issue #48
 */

// eslint-disable-next-line import/prefer-default-export
export async function createExperience(params) {
  const { expId, userId, type, title, description } = params;
  let achievement = {
    completed: false,
    approved: false,
    revisionsNeeded: false,
    athleteNotes: "",
    coachNotes: "",
    athleteAttachment: "",
    coachAttachment: "",
    github: "",
    prLink: "",
  };
  let body = {
    id: expId,
    xp: 2000,
    xpEarned: 0,
    achievements: 0,
    memberId: userId,
    type: type,
    approved: false,
    title: title,
    description: description,
    _01: achievement,
    _02: achievement,
    _03: achievement,
    _04: achievement,
    _05: achievement,
    _06: achievement,
    _07: achievement,
    _08: achievement,
    _09: achievement,
    _10: achievement,
    _11: achievement,
    _12: achievement,
    _13: achievement,
    _14: achievement,
    _15: achievement,
  };
  try {
    const response = await RestAPI.post("pareto", "/experience", { body });
    return response;
  } catch (e) {
    console.log("Error creating EXP: ", e);
  }
}
