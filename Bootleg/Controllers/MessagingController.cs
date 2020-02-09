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
    /// Messaging controller for handling all direct messaging on the app - primarily handling posting messages. The ConversationHub handles the delivery of real-time messages via SignalR websocket connections.
    /// </summary>
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class MessagingController : ControllerBase
    {
        // Private readonly Conversation, User, and Blob service dependencies:
        private readonly IConversationService _conversationService;
        private readonly IUserService _userService;
        private readonly IBlobService _blobService;
        /// <summary>
        /// Constructor that will instantiate our dependencies:
        /// </summary>
        /// <param name="_conversationService">Conversation service.</param>
        /// <param name="_userService">User service.</param>
        /// <param name="_blobService">Blob service.</param>
        public MessagingController(IConversationService _conversationService, IUserService _userService, IBlobService _blobService)
        {
            // Set our instances of our services.
            this._conversationService = _conversationService;
            this._userService = _userService;
            this._blobService = _blobService;
        }
        /// <summary>
        /// Method for getting a list of all a user's conversations.
        /// </summary>
        /// <param name="userId">The user id of the current user.</param>
        /// <returns>DTO containing a list of Conversation objects.</returns>
        [HttpGet("[action]")]
        public async Task<DTO<List<Conversation>>> GetAllConversations(string userId)
        {
            // Surround with try/catch:
            try
            {
                // Return all the conversation of the user using the conversation service:
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
        /// <summary>
        /// Method for creating a conversation between multiple users.
        /// </summary>
        /// <param name="userIds">A list of user ids who will be a part of the Conversation.</param>
        /// <returns>DTO containing the Conversation object that was just created.</returns>
        [HttpPost("[action]")]
        public async Task<DTO<Conversation>> CreateConversation([FromBody] DTO<List<string>> userIds)
        {
            // Surround with try/catch:
            try
            {
                // Get all the users joining the conversation using our user service:
                var users = await _userService.GetUsers(userIds.Data);
                // Return the created conversation using our conversation service:
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
        /// <summary>
        /// Method for sending a message in a conversation.
        /// </summary>
        /// <returns>DTO containing the updated Conversation object.</returns>
        [HttpPost("[action]")]
        public async Task<DTO<Conversation>> SendMessage()
        {
            // Surround with try/catch:
            try
            {
                // Grab the user sending the message:
                var user = await _userService.GetUser(Request.Form["userId"]);
                // Upload the blob to Blob Storage if they happen to be sending an image/video:
                var messageBlob = await _blobService.UploadMessageBlob(Request);
                // Create the message object using our conversation service:
                var message = _conversationService.CreateMessage(Request, messageBlob, user.Data);
                // Get the current conversation that the user is sending the message to:
                var conversation = await _conversationService.GetConversation(Request.Form["conversationId"]);
                // Return the updated Conversation after sending the message:
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