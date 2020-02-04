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

namespace Bootleg.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class MessagingController : ControllerBase
    {
        private readonly IConversationService _conversationService;
        private readonly IContentService _contentService;
        private readonly IUserService _userService;
        /// <summary>
        /// Constructor that will instantiate our dependencies.
        /// </summary>
        /// <param name="_blobService">Service to be injected by the container.</param>
        public MessagingController(IConversationService _conversationService, IContentService _contentService, IUserService _userService)
        {
            // Set our instances of our services.
            this._conversationService = _conversationService;
            this._contentService = _contentService;
            this._userService = _userService;
        }

        [HttpGet("[action]")]
        public async Task<DTO<List<Conversation>>> GetAllConversations(string userId)
        {
            // Surround with try/catch:
            try
            {
                return await _conversationService.GetAllConversations(userId);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<List<Conversation>>()
                {
                    Errors = new Dictionary<string, List<string>>()
                    {
                        ["*"] = new List<string> { ex.Message },
                    },
                    Success = false
                };
            }
        }

        [HttpPost("[action]")]
        public async Task<DTO<Conversation>> CreateConversation([FromBody] DTO<List<string>> userIds)
        {
            try
            {
                var users
                var conversation = await _conversationService.


                var response = await _blobService.UploadContentBlob(Request);
                var user = await _userService.GetUser(Request.Form["userId"]);
                var content = await _contentService.AddContentForUser(response, user.Data);
                await _userService.UpdateUser(content.Data.Item2);

                return new DTO<Conversation>()
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
                return new DTO<Conversation>()
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