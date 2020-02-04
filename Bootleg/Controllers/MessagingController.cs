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
        private readonly IUserService _userService;
        private readonly IBlobService _blobService;
        /// <summary>
        /// Constructor that will instantiate our dependencies.
        /// </summary>
        /// <param name="_blobService">Service to be injected by the container.</param>
        public MessagingController(IConversationService _conversationService, IUserService _userService, IBlobService _blobService)
        {
            // Set our instances of our services.
            this._conversationService = _conversationService;
            this._userService = _userService;
            this._blobService = _blobService;
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
                var users = await _userService.GetUsers(userIds.Data);
                return await _conversationService.CreateConversation(users.Data);
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

        [HttpPost("[action]")]
        public async Task<DTO<Conversation>> SendMessage()
        {
            try
            {
                var user = await _userService.GetUser(Request.Form["userId"]);
                var messageBlob = await _blobService.UploadMessageBlob(Request);
                var message = _conversationService.CreateMessage(Request, messageBlob, user.Data);
                var conversation = await _conversationService.GetConversation(Request.Form["conversationId"]);
                return await _conversationService.SendMessage(conversation.Data, message);
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