using Microsoft.AspNetCore.Mvc;

// Trevor Moore
// CST-451
// 2/7/2019
// This is my own work.

namespace Bootleg.Controllers
{
    /// <summary>
    /// Text Controller for handling all text messages being sent to phone numbers for temporary codes for resetting passwords.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class TextController : ControllerBase
    {
    }
}