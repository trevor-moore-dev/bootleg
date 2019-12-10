using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Bootleg.Models;
using Bootleg.Helpers;
using Bootleg.Services.Business.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Bootleg.Models.DTO;
using System.Collections.Generic;
using Bootleg.Models.Documents;

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

namespace Bootleg.Controllers
{
    /// <summary>
    /// Authentication API controller for handling login, registration, and Google Oauth.
    /// </summary>
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
	[ApiController]
    [Route("api/[controller]")]
	public class AuthenticationController : ControllerBase
    {
        // Private readonly authentication service that will get injected.
        private readonly IAuthenticationService _authenticationService;
        /// <summary>
        /// Constructor that will instantiate our dependencies.
        /// </summary>
        /// <param name="_authenticationService">Service to be injected by the container.</param>
        public AuthenticationController(IAuthenticationService _authenticationService)
        {
            // Set our instance of our authentication service.
            this._authenticationService = _authenticationService;
        }
        /// <summary>
        /// API Endpoint for authenticating Google tokens from their OAuth API. Upon successful authentication, the user will also be registered in our system.
        /// Route: api/Authentication/Google
        /// </summary>
        /// <param name="token">Google OAuth token that needs to be delived in the body of the request.</param>
        /// <returns>DTO encapsulating a list of strings, filled with a signed authenticated token.</returns>
        [AllowAnonymous]
        [HttpPost("Google")]
        public async Task<DTO<List<string>>> AuthenticateGoogleToken([FromBody]DTO<TokenModel> token)
        {
            // Surround with try/catch:
            try
            {
                // Return the result of the AuthenticateGoogleToken() method of our service:
                return await _authenticationService.AuthenticateGoogleToken(token.Data, HttpContext.Response);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
				LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
				return new DTO<List<string>>()
				{
					Errors = new Dictionary<string, List<string>>()
					{
						["*"] = new List<string> { ex.Message },
					},
					Success = false
				};
			}
        }
        /// <summary>
        /// API Endpoint for logging in users.
        /// Route: api/Authentication/Authenticate
        /// </summary>
        /// <param name="userDTO">DTO encapsulating a User object. Send in the body of the request.</param>
        /// <returns>DTO encapsulating a list of strings, filled with a signed authenticated token.</returns>
        [AllowAnonymous]
        [HttpPost("Authenticate")]
        public async Task<DTO<List<string>>> AuthenticateUser([FromBody]DTO<User> userDTO)
        {
            // Surround with try/catch:
            try
            {
                // Return the result of the AuthenticateUser() method of our service:
                return await _authenticationService.AuthenticateUser(userDTO.Data, HttpContext.Response);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<List<string>>()
                {
                    Errors = new Dictionary<string, List<string>>()
                    {
                        ["*"] = new List<string> { ex.Message },
                    },
                    Success = false
                };
            }
        }
        /// <summary>
        /// API Endpoint for registering users.
        /// Route: api/Authentication/Register
        /// </summary>
        /// <param name="userDTO">DTO encapsulating a User object. Send in the body of the request.</param>
        /// <returns>DTO encapsulating a list of strings, filled with a signed authenticated token.</returns>
        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<DTO<List<string>>> RegisterUser([FromBody]DTO<User> userDTO)
        {
            // Surround with try/catch:
            try
            {
                // Return the result of the RegisterUser() method of our service:
                return await _authenticationService.RegisterUser(userDTO.Data, HttpContext.Response);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<List<string>>()
                {
                    Errors = new Dictionary<string, List<string>>()
                    {
                        ["*"] = new List<string> { ex.Message },
                    },
                    Success = false
                };
            }
        }
    }
}