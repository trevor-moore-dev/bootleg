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

namespace Bootleg.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
	[ApiController]
    [Route("api/[controller]")]
	public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IAuthenticationService _authenticationService)
        {
            this._authenticationService = _authenticationService;
        }

        [AllowAnonymous]
        [HttpPost("Google")]
        public async Task<DTO<List<string>>> AuthenticateGoogleToken([FromBody]DTO<TokenModel> token)
        {
            try
            {
				return await _authenticationService.AuthenticateGoogleToken(token.Data, HttpContext.Response);
            }
            catch (Exception ex)
            {
				LoggerHelper.Log(ex);
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

        [AllowAnonymous]
        [HttpPost("Authenticate")]
        public async Task<DTO<List<string>>> AuthenticateUser([FromBody]DTO<User> userDTO)
        {
            try
            {
                return await _authenticationService.AuthenticateUser(userDTO.Data, HttpContext.Response);
            }
            catch (Exception ex)
            {
                LoggerHelper.Log(ex);
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

        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<DTO<List<string>>> RegisterUser([FromBody]DTO<User> userDTO)
        {
            try
            {
                return await _authenticationService.RegisterUser(userDTO.Data, HttpContext.Response);
            }
            catch (Exception ex)
            {
                LoggerHelper.Log(ex);
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