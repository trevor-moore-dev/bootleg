
// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

// Function for returning error responses from the server:
export const formatErrorResponse = error => {
  // If there is an error response:
  if (error.response) {
    // Switch on the status:
    switch (error.response.status) {
      // For status 400 return the response error data:
      case 400:
        return error.response.data;
      // For status 500 return object with success as false and 'Internal server error' as the message in the dictionary:
      case 500:
        return { success: false, errors: { "*": ["Internal server error"] } };
      // For any other status return object with success as false and the error status as the message in the dictionary:
      default:
        return { success: false, errors: { "*": [error.response.status] } };
    }
  }
  // Else return object with success as false and 'No response from server' as the message in the dictionary:
  else {
    return { success: false, errors: { "*": ["No response from server"] } };
  }
};