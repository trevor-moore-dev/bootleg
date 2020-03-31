using Bootleg.Helpers;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// Trevor Moore
// CST-451
// 2/7/2020
// This is my own work.

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
        // Private readonly dependencies that will get injected:
        private readonly IBlobService _blobService;
        private readonly IContentService _contentService;
        private readonly IUserService _userService;
        /// <summary>
        /// Constructor that will instantiate our dependencies.
        /// </summary>
        /// <param name="_blobService">Blob service to be injected by the container.</param>
        /// <param name="_contentService">Content service to be injected by the container.</param>
        /// <param name="_userService">User service to be injected by the container.</param>
        public ContentController(IBlobService _blobService, IContentService _contentService, IUserService _userService)
        {
            // Set our instances of our services.
            this._blobService = _blobService;
            this._contentService = _contentService;
            this._userService = _userService;
        }
        /// <summary>
        /// Method for uploading content on Bootleg - whether that be images, videos, or plain text.
        /// </summary>
        /// <returns>DTO containing a boolean indicating success or failure.</returns>
        [HttpPost("[action]")]
        [DisableRequestSizeLimit]
        public async Task<DTO<bool>> UploadContent()
        {
            // Surround with try/catch:
            try
            {
                // Upload our blob to Blob Storage:
                var response = await _blobService.UploadContentBlob(Request);
                // Grab the user doing the upload:
                var user = await _userService.GetUser(Request.Form["userId"]);
                // Add the content that the user is uploading to the database:
                var content = await _contentService.AddContentForUser(response, user.Data);
                // Update the user:
                await _userService.UpdateUser(content.Data.Item2);

                // Return success if no exceptions are thrown:
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
        /// <summary>
        /// Method for getting all the content that shows up on a user's feed, sorting by most recently posted.
        /// </summary>
        /// <param name="userId">The user id of the current user.</param>
        /// <returns>DTO containing a list of Content objects.</returns>
        [HttpGet("[action]")]
        public async Task<DTO<List<Content>>> GetAllContent(string userId)
        {
            // Surround with try/catch:
            try
            {
                // Grab the user from the database:
                var user = await _userService.GetUser(userId);
                // Return all their content using the content service:
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
        /// <summary>
        /// Method for getting a posted content.
        /// </summary>
        /// <param name="contentId">The content id of the post.</param>
        /// <returns>DTO containing a Content objects.</returns>
        [HttpGet("[action]")]
        public async Task<DTO<Content>> GetContent(string contentId)
        {
            // Surround with try/catch:
            try
            {
                // Return the content using the content service, passing in the desired id:
                return await _contentService.GetContent(contentId);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<Content>()
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
        /// Method for posting comments to a post.
        /// </summary>
        /// <param name="comment">DTO of the comment being posted.</param>
        /// <returns>DTO containing a list of comments for the post.</returns>
        [HttpPost("[action]")]
        public async Task<DTO<List<Content>>> PostComment([FromBody] DTO<Content> comment)
        {
            // Surround with try/catch:
            try
            {
                // Get the user who's posting the comment:
                var result = await _userService.GetUser(comment.Data.UserId);
                // Return the comments of the content using the content service, passing in the desired id and comment:
                return await _contentService.PostComment(comment.Id, comment.Data.ContentBody, result.Data);
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