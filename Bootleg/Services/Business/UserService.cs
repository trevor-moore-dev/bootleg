using Bootleg.Extensions;
using Bootleg.Helpers;
using Bootleg.Models;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Bootleg.Services.Data.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Trevor Moore
// CST-451
// 2/8/2020
// This is my own work.

namespace Bootleg.Services.Business
{
	/// <summary>
	/// User service for handling User related persistence tasks.
	/// </summary>
	public class UserService : IUserService
	{
		// Private readonly data access object to be injected:
		private readonly IDAO<User> _userDAO;
		/// <summary>
		/// Constructor that will instantiate our dependencies that get injected by the container.
		/// </summary>
		/// <param name="userDAO">DAO to be injected.</param>
		public UserService(IDAO<User> userDAO)
		{
			// Set our dependency:
			this._userDAO = userDAO;
		}
		/// <summary>
		/// Method for searching all Users based off username.
		/// </summary>
		/// <param name="username">string of username (can be a partial username).</param>
		/// <returns>DTO containing list of Users.</returns>
		public async Task<DTO<List<User>>> SearchAllUsers(string username)
		{
			// Surround with try/catch:
			try
			{
				// Get all Users:
				var result = await _userDAO.GetAll();
				// If username passed in isn't empty or null:
				if (!string.IsNullOrEmpty(username))
				{
					// Order result by descending similarity to the username passed in:
					result = result.OrderByDescending(x => string.Compare(x.Username, username, true)).ToList();
				}
				// Return the result:
				return new DTO<List<User>>()
				{
					Data = result,
					Success = true
				};
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Throw it up:
				throw e;
			}
		}
		/// <summary>
		/// Method for getting a specific User.
		/// </summary>
		/// <param name="userID">User id to get.</param>
		/// <returns>DTO containing User.</returns>
		public async Task<DTO<User>> GetUser(string userID)
		{
			// Surround with try/catch:
			try
			{
				// Get the user:
				var result = await _userDAO.Get(userID);
				// Return the result:
				return new DTO<User>()
				{
					Data = result,
					Success = true
				};
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Throw it up:
				throw e;
			}
		}
		/// <summary>
		/// Method for getting a list of User data based off of the ids passesd in.
		/// </summary>
		/// <param name="userIds">List of string user ids.</param>
		/// <returns>DTO containing list of Users.</returns>
		public async Task<DTO<List<User>>> GetUsers(List<string> userIds)
		{
			// Surround with try/catch:
			try
			{
				// Get all indexes of user ids passed in:
				var result = await _userDAO.GetAllFromIndexes(userIds);
				// Return the result:
				return new DTO<List<User>>()
				{
					Data = result,
					Success = true
				};
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Throw it up:
				throw e;
			}
		}
		/// <summary>
		/// Method for following a User.
		/// </summary>
		/// <param name="user">User object.</param>
		/// <param name="userID">String user id.</param>
		/// <returns>DTO containing the User.</returns>
		public async Task<DTO<User>> FollowUser(User user, string userID)
		{
			// Surround with try/catch:
			try
			{
				// Instantiate and set the user's following ids if they are null:
				if (user.FollowingIds == null)
				{
					user.FollowingIds = new List<string>() { userID };
				}
				// Else just set the ids:
				else
				{
					user.FollowingIds.Add(userID);
				}
				// Return the updated user:
				return await UpdateUser(user);
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Throw it up:
				throw e;
			}
		}
		/// <summary>
		/// Method for unfollowing a User.
		/// </summary>
		/// <param name="user">User object.</param>
		/// <param name="userID">String user id.</param>
		/// <returns>DTO containing the User.</returns>
		public async Task<DTO<User>> UnfollowUser(User user, string userID)
		{
			// Surround with try/catch:
			try
			{
				// Remove the id if the following ids aren't null:
				if (user.FollowingIds?.Count() > 0)
				{
					user.FollowingIds.Remove(userID);
				}
				// Return the updated user:
				return await UpdateUser(user);
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Throw it up:
				throw e;
			}
		}
		/// <summary>
		/// Method for updating a User.
		/// </summary>
		/// <param name="currentUser">User to update.</param>
		/// <returns>DTO containing the updated User.</returns>
		public async Task<DTO<User>> UpdateUser(User currentUser)
		{
			// Surround with try/catch:
			try
			{
				// Update the user:
				var result = await _userDAO.Update(currentUser.Id, currentUser);
				// Return the result:
				return new DTO<User>()
				{
					Data = result,
					Success = true
				};
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Throw it up:
				throw e;
			}
		}
		/// <summary>
		/// Method for updating a User's profile.
		/// </summary>
		/// <param name="currentUser">User to update.</param>
		/// <param name="request">HttpRequest object.</param>
		/// <param name="httpContext">HttpContext object.</param>
		/// <returns>DTO containing User.</returns>
		public async Task<DTO<User>> UpdateUserProfile(User currentUser, HttpRequest request, HttpContext httpContext)
		{
			// Surround with try/catch:
			try
			{
				// If form keys contain username or email:
				if (request.Form.Keys.Contains("username") || request.Form.Keys.Contains("email"))
				{
					// Get all users from the database using dao:
					var users = await _userDAO.GetAll();
					// If it has username:
					if (request.Form.Keys.Contains("username"))
					{
						// Find a user match in the database with the same exact username (case sensitive):
						var usernameAlreadyExists = users.Any(u => u.Username.Equals(request.Form["username"]));
						// If the username doesn't already exist in any current user, set the new username:
						if (!usernameAlreadyExists)
						{
							currentUser.Username = request.Form["username"];
						}
					}
					// If is has a email:
					if (request.Form.Keys.Contains("email"))
					{
						// Find a user match in the database with the same email (case insensitive):
						var emailAlreadyExists = users.Any(u => u.Email.EqualsIgnoreCase(request.Form["email"]));
						// If email doesn't exist in any current user, set the email:
						if (!emailAlreadyExists)
						{
							currentUser.Email = request.Form["email"];
						}
					}				
				}
				// If form keys contain oldpassword and newpassword, and oldpassword is correct:
				if (request.Form.Keys.Contains("oldpassword")
					&& request.Form.Keys.Contains("newpassword")
					&& currentUser.Password.Equals(SecurityHelper.EncryptPassword(request.Form["oldpassword"], currentUser.Salt)))
				{
					// Generate random salt:
					var salt = SecurityHelper.GenerateSalt();
					// Hash the user's new password using the salt:
					var securePassword = SecurityHelper.EncryptPassword(request.Form["newpassword"], salt);
					// Set new User's password and salt values:
					currentUser.Password = securePassword;
					currentUser.Salt = salt;
				}
				// If form keys contain phone, set the phone:
				if (request.Form.Keys.Contains("phone"))
				{
					currentUser.Phone = request.Form["phone"];
				}
				// If form keys contain bio, set the bio:
				if (request.Form.Keys.Contains("bio"))
				{
					currentUser.Bio = request.Form["bio"];
				}
				// Generate token with new user data:
				var jwt = TokenHelper.GenerateToken(currentUser.Username ?? currentUser.Email, AppSettingsModel.AppSettings.JwtSecret, currentUser.Id, currentUser.ProfilePicUri);
				// Add the jwt to the response's Cookies:
				CookieHelper.AddCookie(httpContext.Response, "Authorization-Token", jwt);
				// Udate the User:
				var result = await _userDAO.Update(currentUser.Id, currentUser);
				// Return the result:
				return new DTO<User>()
				{
					Data = result,
					Success = true
				};
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Throw it up:
				throw e;
			}
		}
		/// <summary>
		/// Method for deleting a User.
		/// </summary>
		/// <param name="userID">String user id.</param>
		/// <returns>DTO containing User.</returns>
		public async Task<DTO<User>> DeleteUser(string userID)
		{
			// Surround with try/catch:
			try
			{
				// Delete the user:
				await _userDAO.Delete(userID);
				// Return success if no exception is thrown:
				return new DTO<User>()
				{
					Success = true
				};
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Throw it up:
				throw e;
			}
		}
	}
}