import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

// Function for dispatching all things regarding authorization:
export default function useAuth() {
  // Setting up useDispatch() and useSelector() hook:
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);

  // Function for getting the authorization cookie:
  const getAuthFromCookie = () => {
    // If we haven't checked for the cookie yet:
    if (!authState.checkedForAuth) {
      // Try to get the cookie:
      const token = Cookies.get("Authorization-Token");
      // If the cookie was grabbed:
      if (token) {
        // TODO: Check if expired?
        // Dispatch the token to update the state in the store:
        login(token);
        // Return the token:
        return token;
      }
      // Dispatch to update checkedForAuth:
      dispatch({
        type: "CHECKED_FOR_AUTH"
      });
    }
    // Else return null:
    return null;
  };
  // Function for getting the authorization token:
  const getToken = () => {
    // If the user is authenticated:
    if (authState.isAuthenticated) {
      // Return the token:
      return authState.token;
    }
    // If we've already checked for the authorization token:
    if (authState.checkedForAuth) {
      // Return null;
      return null;
    }
    // Else return the result of getAuthFromCookie() which should try to get the token from the cookies:
    else {
      return getAuthFromCookie();
    }
  };
  // Function for getting the current user's id:
  const getUserId = () => {
    return authState.user.id;
  };
  // Function for getting the websocket connection if it's there:
  const getConnection = () => {
    // Return the connection (it will be null if it isn't there):
    return authState.signalRConnection;
  };
  // Function for getting the current important id for the current page if it's there:
  const getId = () => {
    // Return the id (it will be null if it isn't there):
    return authState.currentId;
  };
  // Function for dispatching the authorization token which updates the state in the store:
  const login = token => {
    // Dispatch the token and the payload:
    dispatch({
      type: "LOGIN",
      token: token,
      payload: jwt_decode(token)
    });
    // Cookies are set from server.
  };
  // Function for logging out the user and removing the cookies/tokens:
  const logout = () => {
    // Remove the authorization cookie:
    Cookies.remove("Authorization-Token");
    // Dispatch the logout to update the store:
    dispatch({
      type: "LOGOUT"
    });
  };
  // Function for storing the current id:
  const storeId = id => {
    // Dispatch the id to update the store:
    dispatch({
      type: "STORE_ID",
      currentId: id
    });
  };
  // Function for storing the SignalR connection:
  const storeConnection = conn => {
    // Dispatch the connection to update the store:
    dispatch({
      type: "SIGNALR_CONNECTION",
      connection: conn
    });
  };
  // Function for removing the signalr connection:
  const resetConnection = () => {
    // Dispatch the reset to update the store:
    dispatch({
      type: "SIGNALR_CONNECTION",
      connection: null
    });
  };
  // Return our functions:
  return { getAuthFromCookie, authState, login, logout, storeId, storeConnection, resetConnection, getToken, getUserId, getId, getConnection };
}
