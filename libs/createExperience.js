import API from "@aws-amplify/api";

/**
 * Reusable function to create experience items.
 * @TODO refactor this, instead of _01 it needs to be an array item. This will be a long process, but likely not too long.
 * @TODO this will likely entail refactoring how things are stored on Sanity, but will allow for much more flexible stuff. Will need rich text editing to replace the Sanity Rich text.
 */

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
    const response = await API.post("pareto", "/experience", { body });
    return response;
  } catch (e) {
    console.log("Error creating EXP: ", e);
  }
}
