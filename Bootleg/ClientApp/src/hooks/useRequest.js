import useAuth from "./useAuth";
import Axios from "axios";
import { formatErrorResponse } from "../helpers/errorHelper";

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

// Function for making get and post requests to the server:
export default function useRequest() {
  // Grabbing our auth token if it's there:
  const { getToken } = useAuth();
  const token = getToken();
  // Post function for sending a post request to the specified URI with any given body parameters:
  const post = async (url, body) => {
    // Set the headers to be json:
    let headers = {
      "Content-Type": "application/json"
    };
    // If the auth token is there put it in the Authorization of the header:
    if (token) {
      headers = { ...headers, Authorization: "Bearer " + token };
    }
    // Initialize the response:
    let response = {};
    // Use Axios to send the post request for the given URI, body, and headers:
    await Axios.post(url, body, {
      headers: headers
    })
      // Set response of the data in a promise:
      .then(res => {
        response = res.data;
      })
      // Catch any errors and format them:
      .catch(error => {
        response = formatErrorResponse(error);
      });
    // Return the response:
    return response;
  };
  // Get function for sending a get request to the specified URI with any given body parameters:
  const get = async (url, params) => {
    // Initialize the headers:
    let headers = {};
    // If the auth token is there put it in the Authorization of the header:
    if (token) {
      headers = { Authorization: "Bearer " + token };
    }
    // Initialize the response:
    let response = {};
    // Use Axios to send the get request for the given URI, body, and headers:
    await Axios.get(url, {
      params: params,
      headers: headers
    })
      // Set response of the data in a promise:
      .then(res => {
        response = res.data;
      })
      // Catch any errors and format them:
      .catch(error => {
        response = formatErrorResponse(error);
      });
    // Return the response:
    return response;
  };

  return { get, post };
}