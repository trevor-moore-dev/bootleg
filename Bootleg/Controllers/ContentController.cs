using Bootleg.Helpers;
using Bootleg.Models;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
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
        private readonly IBlobService _blobService;
        private readonly IContentService _contentService;
        private readonly IUserService _userService;
        /// <summary>
        /// Constructor that will instantiate our dependencies.
        /// </summary>
        /// <param name="_blobService">Service to be injected by the container.</param>
        public ContentController(IBlobService _blobService, IContentService _contentService, IUserService _userService)
        {
            // Set our instances of our services.
            this._blobService = _blobService;
            this._contentService = _contentService;
            this._userService = _userService;
        }
        [HttpPost("[action]")]
        [DisableRequestSizeLimit]
        public async Task<DTO<bool>> UploadContent()
        {
            try
            {
                var response = await _blobService.UploadContentBlob(Request);
                var user = await _userService.GetUser(Request.Form["userId"]);
                var content = await _contentService.AddContentForUser(response, user.Data);
                await _userService.UpdateUser(content.Data.Item2);

                return new DTO<bool>()
                {
                    Success = true
                };
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<bool>()
                {
                    Errors = new Dictionary<string, List<string>>()
                    {
                        ["*"] = new List<string> { ex.Message },
                    },
                    Success = false
                };
            }
        }

        [HttpGet("[action]")]
        public async Task<DTO<List<Content>>> GetAllContent(string userId)
        {
            // Surround with try/catch:
            try
            {
                var user = await _userService.GetUser(userId);
                return await _contentService.GetAllContent(user.Data);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<List<Content>>()
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