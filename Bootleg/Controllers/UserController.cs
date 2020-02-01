using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Bootleg.Helpers;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Bootleg.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IContentService _contentService;
        private readonly IUserService _userService;
        private readonly IBlobService _blobService;

        /// <summary>
        /// Constructor that will instantiate our dependencies.
        /// </summary>
        /// <param name="_blobService">Service to be injected by the container.</param>
        public UserController(IContentService _contentService, IUserService _userService, IBlobService _blobService)
        {
            // Set our instances of our services.
            this._contentService = _contentService;
            this._userService = _userService;
            this._blobService = _blobService;
        }

        [HttpGet("[action]")]
        public async Task<DTO<User>> GetUser(string userId)
        {
            // Surround with try/catch:
            try
            {
                var user = await _userService.GetUser(userId);
                return new DTO<User>()
                {
                    Data = user.Data,
                    Success = true
                };
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

        [HttpPost("[action]")]
        public async Task<DTO<User>> FollowUser([FromBody] DTO<string> user)
        {
            try
            {
                var loggedInUser = await _userService.GetUser(user.Data);
                return await _userService.FollowUser(loggedInUser.Data, user.Id);
            }
            catch (Exception ex)
            {
                LoggerHelper.Log(ex);
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

        [HttpPost("[action]")]
        public async Task<DTO<User>> UnfollowUser([FromBody] DTO<string> user)
        {
            try
            {
                var loggedInUser = await _userService.GetUser(user.Data);
                return await _userService.UnfollowUser(loggedInUser.Data, user.Id);
            }
            catch (Exception ex)
            {
                LoggerHelper.Log(ex);
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

        [HttpGet("[action]")]
        public async Task<DTO<Tuple<User, List<Content>>>> GetUserContent(string userId)
        {
            // Surround with try/catch:
            try
            {
                var user = await _userService.GetUser(userId);
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

        [HttpPost("[action]")]
        [DisableRequestSizeLimit]
        public async Task<DTO<User>> UpdateUser()
        {
            try
            {
                var user = await _userService.GetUser(Request.Form["userId"]);
                var currentUser = await _blobService.UpdateUserProfilePic(user.Data, Request);
                var updatedUser = await _userService.UpdateUserProfile(currentUser, Request, HttpContext);

                return new DTO<User>()
                {
                    Data = updatedUser.Data,
                    Success = true
                };
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

        [HttpGet("[action]")]
        public async Task<DTO<List<User>>> SearchAllUsers(string username)
        {
            // Surround with try/catch:
            try
            {
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