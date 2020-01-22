using Bootleg.Helpers;
using Bootleg.Models;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Models.Enums;
using Bootleg.Services.Business.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        // Private readonly authentication service that will get injected.
        private readonly IBlobService _blobService;
        // Private readonly content service that will get injected.
        private readonly IContentService _contentService;
        private readonly IAuthenticationService _authenticationService;
        /// <summary>
        /// Constructor that will instantiate our dependencies.
        /// </summary>
        /// <param name="_blobService">Service to be injected by the container.</param>
        public ContentController(IBlobService _blobService, IContentService _contentService, IAuthenticationService _authenticationService)
        {
            // Set our instances of our services.
            this._blobService = _blobService;
            this._contentService = _contentService;
            this._authenticationService = _authenticationService;
        }
        [HttpPost("UploadContent")]
        [DisableRequestSizeLimit]
        public async Task<DTO<Uri>> UploadContent(IFormCollection form)
        {
            // Surround with try/catch:
            try
            {
                var content = new Content();
                Uri mediaUri = null;
                bool isImage = false;

                if (form.Any() && form.Keys.Contains("token"))
                {
                    var authenticate = _authenticationService.AuthenticateToken(form["token"], AppSettingsModel.AppSettings.JwtSecret);
                    content.UserId = authenticate.Data[1];

                    if (form.Keys.Contains("contentBody"))
                    {
                        content.ContentBody = form["contentBody"];
                    }
                    if (form.Files.Count > 0)
                    {
                        mediaUri = await _blobService.UploadBlob(form.Files[0]);
                        content.MediaUri = mediaUri.ToString();
                        content.MediaType = BlobHelper.BlobIsImage(form.Files[0].FileName) ? MediaType.Image : MediaType.Video;
                    }
                    await _contentService.AddContent(content);
                    return new DTO<Uri>()
                    {
                        Success = true
                    };
                }
                else
                {
                    throw new Exception("Could not find user.");
                }




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