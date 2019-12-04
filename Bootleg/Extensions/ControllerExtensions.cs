using Microsoft.AspNetCore.Mvc;
using Bootleg.Models.DTO;

namespace Bootleg.Extensions
{
    public static class ControllerExtensions
    {
        public static IActionResult GenerateResponse(this ControllerBase controllerBase, Status response)
        {
            if (response.Success)
            {
                return controllerBase.Ok(response);
            }

            return controllerBase.BadRequest(response);
        }
    }
}