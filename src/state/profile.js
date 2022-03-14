export const GET_USER = "GET_USER";

const initialState = null;
function profile(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return { ...action.user };
    default:
      return state;
  }
}

export function getUser(user) {
  return { type: GET_USER, user };
}

export default profile;
