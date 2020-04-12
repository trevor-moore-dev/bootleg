using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Bootleg.Helpers;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

// Trevor Moore
// CST-451
// 2/7/2020
// This is my own work.

namespace Bootleg.Controllers
{
    /// <summary>
    /// User Controller for handling everything related to user interactions - following, unfollowing, viewing profiles, etc.
    /// </summary>
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        // Private readonly Content, User, and Blob service dependencies:
        private readonly IContentService _contentService;
        private readonly IUserService _userService;
        private readonly IBlobService _blobService;
        private readonly IConversationService _conversationService;
        /// <summary>
        /// Constructor for where all our dependencies will get injected:
        /// </summary>
        /// <param name="_contentService">Content service.</param>
        /// <param name="_userService">User service.</param>
        /// <param name="_blobService">Blob service.</param>
        /// <param name="_conversationService">Conversation service.</param>
        public UserController(IContentService _contentService, IUserService _userService, IBlobService _blobService, IConversationService _conversationService)
        {
            // Set our instances of our services.
            this._contentService = _contentService;
            this._userService = _userService;
            this._blobService = _blobService;
            this._conversationService = _conversationService;
        }
        /// <summary>
        /// Method for Getting a User object.
        /// </summary>
        /// <param name="userId">The user id of the user you want to get.</param>
        /// <returns>DTO containing the User object.</returns>
        [HttpGet("[action]")]
        public async Task<DTO<User>> GetUser(string userId)
        {
            // Surround with try/catch:
            try
            {
                // Return the user using our User service:
                return await _userService.GetUser(userId);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<User>()
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
        /// Method for Getting a User's Followings.
        /// </summary>
        /// <param name="userId">The user id of the user you want to get the followings for.</param>
        /// <returns>DTO containing the List of User objects.</returns>
        [HttpGet("[action]")]
        public async Task<DTO<List<User>>> GetFollowings(string userId)
        {
            // Surround with try/catch:
            try
            {
                // Return the followings using our User service:
                return await _userService.GetUserFollowings(userId);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<List<User>>()
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
        /// Post method for following a user.
        /// </summary>
        /// <param name="user">DTO containing a string (which is the Id of the current user).</param>
        /// <returns>DTO containing the User object.</returns>
        [HttpPost("[action]")]
        public async Task<DTO<User>> FollowUser([FromBody] DTO<string> user)
        {
            // Surround with try/catch:
            try
            {
                // Get the current user who wants to follow someone:
                var loggedInUser = await _userService.GetUser(user.Data);
                // Follow the user id that was passed in:
                return await _userService.FollowUser(loggedInUser.Data, user.Id);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<User>()
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
        /// Post method for unfollowing a user.
        /// </summary>
        /// <param name="user">DTO containing the string (user id of the current user and user that they want to follow).</param>
        /// <returns>DTO containing the User object.</returns>
        [HttpPost("[action]")]
        public async Task<DTO<User>> UnfollowUser([FromBody] DTO<string> user)
        {
            // Surround with try/catch:
            try
            {
                // Get the current logged in user:
                var loggedInUser = await _userService.GetUser(user.Data);
                // Following the user they want and return the User:
                return await _userService.UnfollowUser(loggedInUser.Data, user.Id);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<User>()
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
        /// Get method for getting the "profile" of a user: their User data and all their Content that they've posted.
        /// </summary>
        /// <param name="userId">The user id of the User you want.</param>
        /// <returns>DTO containing a Tuple of the User and a List of their Content.</returns>
        [HttpGet("[action]")]
        public async Task<DTO<Tuple<User, List<Content>>>> GetUserContent(string userId)
        {
            // Surround with try/catch:
            try
            {
                // Get the current User:
                var user = await _userService.GetUser(userId);
                // Return all their content all with their User data:
                return await _contentService.GetUserContent(user.Data);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<Tuple<User, List<Content>>>()
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
        /// Post data for updating a user profile.
        /// </summary>
        /// <returns>DTO containing the User object that is being updated.</returns>
        [HttpPost("[action]")]
        [DisableRequestSizeLimit]
        public async Task<DTO<User>> UpdateUser()
        {
            // Surround with try/catch:
            try
            {
                // Get the current user:
                var user = await _userService.GetUser(Request.Form["userId"]);
                // Update the user profile pic if needed:
                var currentUser = await _blobService.UpdateUserProfilePic(user.Data, Request);
                await _conversationService.UpdateUserProfilePic(currentUser);
                await _contentService.UpdateUserProfilePic(currentUser);
                // Update and return the user data:
                return await _userService.UpdateUserProfile(currentUser, Request, HttpContext);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<User>()
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
        /// Get method for doing a search of users. This will be used for the search bar on the app header.
        /// </summary>
        /// <param name="username">String of a (partial) username to search for.</param>
        /// <returns>DTO containing a list of User objects that match the search.</returns>
        [HttpGet("[action]")]
        public async Task<DTO<List<User>>> SearchAllUsers(string username)
        {
            // Surround with try/catch:
            try
            {
                // Return the results of the search using the user service:
                return await _userService.SearchAllUsers(username);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception:
                LoggerHelper.Log(ex);
                // Return the error and set success to false, encapsulated in a DTO:
                return new DTO<List<User>>()
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