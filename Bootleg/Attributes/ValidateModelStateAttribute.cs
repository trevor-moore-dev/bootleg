using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Bootleg.Extensions;
using Bootleg.Models.DTO;

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

namespace Bootleg.Attributes
{
    /// <summary>
    /// Custom Filter Attribute for checking if ModelStates are valid and returning corresponding errors. Extends ActionFilterAttribute.
    /// </summary>
    public class ValidateModelStateAttribute : ActionFilterAttribute
    {
        /// <summary>
        /// OnActionExecuting() override that will set the result to be a bad request with the corresponding errors if the ModelState is not valid.
        /// </summary>
        /// <param name="context">Context of type ActionExecutingContext.</param>
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // If the ModelState is not valid:
            if (!context.ModelState.IsValid)
            {
                // Set the result of the context to be a bad request object with the ModelState's errors:
                context.Result = new BadRequestObjectResult(new Status()
                {
                    Errors = context.ModelState.GetErrors()
                });
            }
        }
    }
}
