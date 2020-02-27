using Google.Apis.Auth;
using Bootleg.Models;
using System;
using System.Threading.Tasks;
using Bootleg.Helpers;
using Microsoft.AspNetCore.Http;
using Bootleg.Models.DTO;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Bootleg.Models.Documents;
using Bootleg.Services.Data.Interfaces;
using Bootleg.Extensions;

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

namespace Bootleg.Services.Business.Interfaces
{
	/// <summary>
	/// Service for authenticating users to the database. Implements the IAuthenticationService interface.
	/// </summary>
	public class AuthenticationService : IAuthenticationService
	{
		// Private readonly data access object to be injected:
		private readonly IDAO<User> _userDAO;
		/// <summary>
		/// Constructor that will instantiate our dependencies that get injected by the container.
		/// </summary>
		/// <param name="userDAO">DAO to be injected.</param>
		public AuthenticationService(IDAO<User> userDAO)
		{
			// Set our dependency:
			this._userDAO = userDAO;
		}
		/// <summary>
		/// Method for authenticating Google OAuth tokens.
		/// </summary>
		/// <param name="token">Token as type of TokenModel.</param>
		/// <param name="httpContext">HttpContext as type of HttpContext.</param>
		/// <returns>DTO encapsulating a list of strings of validated token.</returns>
		public async Task<DTO<List<string>>> AuthenticateGoogleToken(TokenModel token, HttpContext httpContext)
		{
			// Surround with try/catch:
			try
			{
				var jwt = string.Empty;
				// Validate the Google token. This will throw an exception if it isn't valid:
				var payload = await GoogleJsonWebSignature.ValidateAsync(token.TokenId, new GoogleJsonWebSignature.ValidationSettings());
				// Get all users from the database using dao:
				var users = await _userDAO.GetAll();
				// Find a user match in the database with the same email (case insensitive):
				var userMatch = users.FirstOrDefault(u => u.Email.EqualsIgnoreCase(payload.Email));

				// If the match isn't null:
				if (userMatch != null)
				{
					// Generate a JWT to login the user:
					jwt = TokenHelper.GenerateToken(userMatch.Username, AppSettingsModel.AppSettings.JwtSecret, userMatch.Id, userMatch.ProfilePicUri);
				}
				else
				{
					// TODO: Email this to user so that they can login with it and change it later.
					// Generate random temporary password:
					var temporaryPassword = SecurityHelper.GenerateRandomPassword();
					// Generate salt:
					var salt = SecurityHelper.GenerateSalt();
					// Hash the temporary password using the salt:
					var securePassword = SecurityHelper.EncryptPassword(temporaryPassword, salt);
					// Instantiate new User to be inserted into the database using credentials:
					var user = new User()
					{
						Email = payload.Email,
						Username = payload.Email,
						Phone = string.Empty,
						Password = securePassword,
						Salt = salt
					};
					// Add User to the database:
					await _userDAO.Add(user);
					// Generate a JWT so that the user can login:
					jwt = TokenHelper.GenerateToken(payload.Email, AppSettingsModel.AppSettings.JwtSecret, user.Id, payload.Picture);

				}
				// Add the token to a cookie:
				CookieHelper.AddCookie(httpContext.Response, "Authorization-Token", jwt);
				// Return successful with the JWT:
				return new DTO<List<string>>()
				{
					Success = true,
					Data = new List<string>() { jwt }
				};
            }
			// Catch any exceptions:
			catch (Exception e)
			{
				// Log the exception:
				LoggerHelper.Log(e);
				// Throw the exception:
				throw e;
            }
        }
		/// <summary>
		/// Method for authenticating JWTs.
		/// </summary>
		/// <param name="token">Token as type of string.</param>
		/// <param name="secretKey">SecretKey as type of string.</param>
		/// <returns>DTO encapsulating a list of strings of validated token.</returns>
		public DTO<List<string>> AuthenticateToken(string token, string secretKey)
		{
			// Surround with try/catch:
			try
			{
				// Create token validation parameters using the specified secret key:
				var validationParameters = new TokenValidationParameters()
				{
					ValidIssuer = AppSettingsModel.AppSettings.AppDomain,
					ValidAudiences = new[] { AppSettingsModel.AppSettings.AppAudience },
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
					ValidateIssuer = true,
					ValidateAudience = true,
					ValidateIssuerSigningKey = true
				};
				// Create JWT token handler and validate the token with it:
				JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
				var user = handler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
				// If the validated token is null, validation was unsuccessful:
				if (validatedToken == null)
				{
					// Throw exception:
					throw new Exception("Failed to validate JWT.");
				}
				// Else it was successful:
				else
				{
					// Return successful with the values of the JWT:
					return new DTO<List<string>>()
					{
						Success = true,
						Data = new List<string>()
						{
							user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? string.Empty,
							user.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Azp)?.Value ?? string.Empty,
							user.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Aud)?.Value ?? string.Empty
						}
					};
				}
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Log the exception:
				LoggerHelper.Log(e);
				// Throw the exception:
				throw e;
			}
		}
		/// <summary>
		/// Method for logging in a user.
		/// </summary>
		/// <param name="user">User as type of User.</param>
		/// <param name="httpContext">HttpContext as type of HttpContext.</param>
		/// <returns>DTO encapsulating a list of strings of validated token.</returns>
		public async Task<DTO<List<string>>> AuthenticateUser(User user, HttpContext httpContext)
		{
			// Surround with try/catch:
			try
			{
				// Get all users from the database using dao:
				var users = await _userDAO.GetAll();
				// Find a user match in the database with the same exact username (case sensitive) or the same email (case insensitive):
				var userMatch = users.FirstOrDefault(u =>
					(u.Email.EqualsIgnoreCase(user.Username)) ||
					(!string.IsNullOrEmpty(u.Username) && u.Username.Equals(user.Username)));
				
				// If the match isn't null and the password hashes are an exact match, user is authenticated:
				if (userMatch != null && userMatch.Password.Equals(SecurityHelper.EncryptPassword(user.Password, userMatch.Salt)))
				{
					// Generate a JWT to login the user:
					var jwt = TokenHelper.GenerateToken(userMatch.Username ?? userMatch.Email, AppSettingsModel.AppSettings.JwtSecret, userMatch.Id, userMatch.ProfilePicUri);
					// Add the JWT to a cookie:
					CookieHelper.AddCookie(httpContext.Response, "Authorization-Token", jwt);
					// Return successful with the JWT:
					return new DTO<List<string>>()
					{
						Success = true,
						Data = new List<string>() { jwt }
					};
				}
				// Else user entered in wrong credentials:
				else
				{
					throw new Exception("Username or Password is incorrect.");
				}
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Log the exception:
				LoggerHelper.Log(e);
				// Throw the exception:
				throw e;
			}
		}
		/// <summary>
		/// Method for registering a user into the db.
		/// </summary>
		/// <param name="user">User as type of User.</param>
		/// <param name="httpContext">HttpContext as type of HttpContext.</param>
		/// <returns>DTO encapsulating a list of strings of validated token.</returns>
		public async Task<DTO<List<string>>> RegisterUser(User user, HttpContext httpContext)
		{
			// Surround with try/catch:
			try
			{
				// Get all users from the database using dao:
				var users = await _userDAO.GetAll();
				// Run validation rules:
				// Validate that email and phone are not null:
				if (string.IsNullOrEmpty(user.Email) && string.IsNullOrEmpty(user.Phone))
				{
					// Throw exception if they're null:
					throw new Exception("Email OR Phone is required.");
				}
				// Validate that the new email is not existent in the database:
				if (users.Any(u => u.Email.EqualsIgnoreCase(user.Email)))
				{
					// Throw exception if it is:
					throw new Exception("Email is already in use. Please try again.");
				}
				// Validate that username is not existent in the database:
				else if (users.Any(u => u.Username.EqualsIgnoreCase(user.Username)))
				{
					// Throw exception if it is:
					throw new Exception("Username is already taken. Please try again.");
				}
				// TODO: Add in Email, Phone, Username, and Password length/complexity requirements.
				// Else validation has passed:
				else
				{
					// Generate random salt:
					var salt = SecurityHelper.GenerateSalt();
					// Hash the user's entered password using the salt:
					var securePassword = SecurityHelper.EncryptPassword(user.Password, salt);
					var profilePicHolder = ImageHelper.GetServerImagePath($"generic-profile-picture-{new Random().Next(1, 6)}.jpg");
					// Set new User's password and salt values:
					user.ProfilePicUri = profilePicHolder;
					user.Password = securePassword;
					user.Salt = salt;
					// Add User to the database:
					await _userDAO.Add(user);
					// Generate JWT to login the user:
					var jwt = TokenHelper.GenerateToken(user.Username ?? user.Email, AppSettingsModel.AppSettings.JwtSecret, user.Id, profilePicHolder);
					// Add the JWT to a cookie:
					CookieHelper.AddCookie(httpContext.Response, "Authorization-Token", jwt);
					// Return successful with the JWT:
					return new DTO<List<string>>()
					{
						Success = true,
						Data = new List<string>() { jwt }
					};
				}
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Log the exception:
				LoggerHelper.Log(e);
				// Throw the exception:
				throw e;
			}
		}
	}
}