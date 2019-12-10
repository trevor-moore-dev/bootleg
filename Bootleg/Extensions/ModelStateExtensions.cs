using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

namespace Bootleg.Extensions
{
    /// <summary>
    /// ModelState extensions class for all ModelState extension methods.
    /// </summary>
    public static class ModelStateExtensions
    {
        /// <summary>
        /// Method for getting the errors of the ModelState and encapsulating them in a Dictionary response.
        /// </summary>
        /// <param name="modelState">The invoking ModelState.</param>
        /// <returns>Dictionary of string keys and List of string values, which will be filled with the errors, if any.</returns>
        public static Dictionary<string, List<string>> GetErrors(this ModelStateDictionary modelState)
        {
            // Instantiate Dictionary of string keys and List of string values:
            var result = new Dictionary<string, List<string>>();
            // Grab any errors of any fields in the model using LINQ:
            var erroneousFields = modelState.Where(ms => ms.Value.Errors.Any())
                .Select(x => new {x.Key, x.Value.Errors});
            // Loop through each errored field:
            foreach (var erroneousField in erroneousFields)
            {
                // Store the key of the error:
                var fieldKey = erroneousField.Key;
                // Initialize the value of the key in the result Dictionary:
                result[fieldKey] = new List<string>();
                // Loop through each error in the Errors:
                foreach (var error in erroneousField.Errors)
                {
                    // Add the error message to the value of the key:
                    result[fieldKey].Add(error.ErrorMessage);
                }
            }
            // Return the result:
            return result;
        }
    }
}