
// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

// Set constant for blank initial state so that we can reuse it:
const initialState = {
  isAuthenticated: false,
  token: "",
  user: {
    email: "",
    profilePic: "",
    id: ""
  },
  checkedForAuth: false,
  signalRConnection: null
};

// Set constant for authorization reducer to update our state in the store:
const authReducer = (state, action) => {
  // If state has a value, set the state equal to state, otherwise set state equal to initialState:
  state = state || initialState;
  // Switch on the action of the dispatch:
  switch (action.type) {
    // On login:
    case "LOGIN":
      // Return the updated state with the dispatch values:
      return {
        ...state,
        user: {
          email: action.payload.sub,
          profilePic: action.payload.aud[0],
          id: action.payload.azp
        },
        isAuthenticated: true,
        token: action.token
      };
    // On logout:
    case "LOGOUT":
      // Return the updated state with the values of the initial state:
      return {
        ...initialState
      };
    // On checked for auth:
    case "CHECKED_FOR_AUTH":
      // Return the updated state with checkedForAuth as true:
      return { ...state, checkedForAuth: true };
    // On SignalR Connection:
    case "SIGNALR_CONNECTION":
      // Return the updated state with the connection:
      return { ...state, signalRConnection: action.connection };
    // On default:
    default:
      // Simply return the state:
      return state;
  }
};

export default authReducer;
