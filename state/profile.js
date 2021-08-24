export const GET_USER = "GET_USER";

const initialState = {
  fName: "Mikha'el",
  lName: "",
  email: "michael@pareto.education",
  github: "mikhael28",
  id: "b9c6ec04-26f2-4298-95d7-a12df090dec9",
  score: 0.78,
  careerPercentage: 0.78,
};

function profile(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      console.log("Initial profile state init");
      return { ...initialState };
    default:
      return state;
  }
}

export function getUser(user) {
  return { type: GET_USER, user };
}

export default profile;
