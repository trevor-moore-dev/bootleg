using Bootleg.Extensions;
using Bootleg.Helpers;
using Bootleg.Models;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Bootleg.Services.Data.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bootleg.Services.Business
{
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
		public async Task<DTO<List<User>>> GetAllUsers()
		{
			try
			{
				var result = await _userDAO.GetAll();
				return new DTO<List<User>>()
				{
					Data = result,
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DTO<User>> GetUser(string userID)
		{
			try
			{
				var result = await _userDAO.Get(userID);
				return new DTO<User>()
				{
					Data = result,
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DTO<User>> UpdateUser(User currentUser)
		{
			try
			{
				var result = await _userDAO.Update(currentUser.Id, currentUser);

				return new DTO<User>()
				{
					Data = result,
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DTO<User>> UpdateUserProfile(User currentUser, HttpRequest request, HttpContext httpContext)
		{
			try
			{

				if (request.Form.Keys.Contains("username") || request.Form.Keys.Contains("email"))
				{
					// Get all users from the database using dao:
					var users = await _userDAO.GetAll();

					if (request.Form.Keys.Contains("username"))
					{
						// Find a user match in the database with the same exact username (case sensitive) or the same email (case insensitive):
						var usernameAlreadyExists = users.Any(u => u.Username.Equals(request.Form["username"]));

						if (!usernameAlreadyExists)
						{
							currentUser.Username = request.Form["username"];
						}
					}

					if (request.Form.Keys.Contains("email"))
					{
						// Find a user match in the database with the same exact username (case sensitive) or the same email (case insensitive):
						var emailAlreadyExists = users.Any(u => u.Email.EqualsIgnoreCase(request.Form["email"]));

						if (!emailAlreadyExists)
						{
							currentUser.Email = request.Form["email"];
						}
					}				
				}

				if (request.Form.Keys.Contains("oldpassword")
					&& request.Form.Keys.Contains("newpassword")
					&& currentUser.Password.Equals(SecurityHelper.EncryptPassword(request.Form["oldpassword"], currentUser.Salt)))
				{
					// If password hashes are an exact match, user can change password, generate random salt
					var salt = SecurityHelper.GenerateSalt();
					// Hash the user's entered password using the salt:
					var securePassword = SecurityHelper.EncryptPassword(request.Form["newpassword"], salt);
					// Set new User's password and salt values:
					currentUser.Password = securePassword;
					currentUser.Salt = salt;
				}

				if (request.Form.Keys.Contains("phone"))
				{
					currentUser.Phone = request.Form["phone"];
				}

				if (request.Form.Keys.Contains("bio"))
				{
					currentUser.Bio = request.Form["bio"];
				}

				var jwt = TokenHelper.GenerateToken(currentUser.Username ?? currentUser.Email, AppSettingsModel.AppSettings.JwtSecret, currentUser.Id, currentUser.ProfilePicUri);
				CookieHelper.AddCookie(httpContext.Response, "Authorization-Token", jwt);

				var result = await _userDAO.Update(currentUser.Id, currentUser);

				return new DTO<User>()
				{
					Data = result,
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DTO<User>> DeleteUser(string userID)
		{
			try
			{
				await _userDAO.Delete(userID);
				return new DTO<User>()
				{
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}
	}
}