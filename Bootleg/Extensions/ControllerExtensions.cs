using Microsoft.AspNetCore.Mvc;
using Bootleg.Models.DTO;

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

namespace Bootleg.Extensions
{
    /// <summary>
    /// Controller extensions class for all controller extension methods.
    /// </summary>
    public static class ControllerExtensions
    {
        /// <summary>
        /// Extension method for generating 200 / 400 responses upon success or failure.
        /// </summary>
        /// <param name="controllerBase">The invoking controller.</param>
        /// <param name="response">The status object of the response.</param>
        /// <returns>Result of the request.</returns>
        public static IActionResult GenerateResponse(this ControllerBase controllerBase, Status response)
        {
            // If the response was successful, return the response in a 200 result:
            if (response.Success)
            {
                return controllerBase.Ok(response);
            }
            // Else return the response in a 400 result:
            return controllerBase.BadRequest(response);
        }
    }
}