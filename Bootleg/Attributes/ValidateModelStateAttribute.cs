using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Bootleg.Extensions;
using Bootleg.Models.DTO;

namespace Bootleg.Attributes
{
    public class ValidateModelStateAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                context.Result = new BadRequestObjectResult(new Status()
                {
                    Errors = context.ModelState.GetErrors()
                });
            }
        }
    }
}
