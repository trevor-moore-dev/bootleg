using Bootleg.Helpers;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Bootleg.Controllers
{
    /// <summary>
    /// Content API controller for everything related to content/posts on the site.
    /// </summary>
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class ContentController : ControllerBase
    {
        // Private readonly authentication service that will get injected.
        private readonly IBlobService _blobService;
        /// <summary>
        /// Constructor that will instantiate our dependencies.
        /// </summary>
        /// <param name="_blobService">Service to be injected by the container.</param>
        public ContentController(IBlobService _blobService)
        {
            // Set our instance of our authentication service.
            this._blobService = _blobService;
        }
        [HttpPost("UploadContent")]
        [DisableRequestSizeLimit]
        [AllowAnonymous]
        public async Task<DTO<Uri>> UploadContent(IFormFile file)
        {
            // Surround with try/catch:
            try
            {
                // Return the result of the AuthenticateGoogleToken() method of our service:
                return await _blobService.UploadBlob(file);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<Uri>()
                {
                    Errors = new Dictionary<string, List<string>>()
                    {
                        ["*"] = new List<string> { ex.Message },
                    },
                    Success = false
                };
            }
        }

        [HttpGet("GetAllContent")]
        [AllowAnonymous]
        public async Task<DTO<List<Uri>>> GetAllContent()
        {
            // Surround with try/catch:
            try
            {
                // Return the result of the AuthenticateGoogleToken() method of our service:
                return await _blobService.GetAllBlobs();
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<List<Uri>>()
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