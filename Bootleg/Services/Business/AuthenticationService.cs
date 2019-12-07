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

namespace Bootleg.Services.Business.Interfaces
{
	public class AuthenticationService : IAuthenticationService
	{
		private readonly IDAO<User, DTO<List<User>>> _userDAO;

		public AuthenticationService(IDAO<User, DTO<List<User>>> userDAO)
		{
			this._userDAO = userDAO;
		}

		public async Task<DTO<List<string>>> AuthenticateGoogleToken(TokenModel token, HttpResponse response)
		{
			try
			{
				var payload = await GoogleJsonWebSignature.ValidateAsync(token.TokenId, new GoogleJsonWebSignature.ValidationSettings());
				var users = await _userDAO.GetAll();

				// If Google login is already in the db, then we don't need to add them again:
				if (!users.Data.Any(u => u.Email.EqualsIgnoreCase(payload.Email)))
				{
					// Email this to user so that they can login with it and change it later:
					var temporaryPassword = SecurityHelper.GenerateRandomPassword();
					var salt = SecurityHelper.GenerateSalt();
					var securePassword = SecurityHelper.EncryptPassword(temporaryPassword, salt);

					var user = new User()
					{
						Email = payload.Email,
						Username = payload.Email,
						Phone = string.Empty,
						Password = securePassword,
						Salt = salt
					};

					await _userDAO.Add(user);
				}

				var jwt = TokenHelper.GenerateToken(payload.Email, AppSettingsModel.AppSettings.JwtSecret, string.Empty);

				CookieHelper.AddCookie(response, "Authorization-Token", jwt);
				CookieHelper.AddCookie(response, "Avatar-Url", payload.Picture);

				return new DTO<List<string>>()
				{
					Success = true,
					Data = new List<string>() { jwt }
				};
            }
			catch (Exception e)
			{
				throw e;
            }
        }

		public DTO<List<string>> AuthenticateToken(string token, string secretKey)
		{
			try
			{
				var validationParameters = new TokenValidationParameters()
				{
					ValidIssuer = AppSettingsModel.AppSettings.AppDomain,
					ValidAudiences = new[] { AppSettingsModel.AppSettings.AppAudience },
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
					ValidateIssuer = true,
					ValidateAudience = true,
					ValidateIssuerSigningKey = true
				};

				JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
				var user = handler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

				if (validatedToken == null)
				{
					throw new Exception("Failed to validate JWT.");
				}
				else
				{
					return new DTO<List<string>>()
					{
						Success = true,
						Data = new List<string>()
						{
							user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? string.Empty,
							user.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Azp)?.Value ?? string.Empty
						}
					};
				}
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DTO<List<string>>> AuthenticateUser(User user, HttpResponse response)
		{
			try
			{
				var users = await _userDAO.GetAll();
				var userMatch = users.Data.FirstOrDefault(u =>
					(u.Email.EqualsIgnoreCase(user.Username)) ||
					(!string.IsNullOrEmpty(u.Username) && u.Username.Equals(user.Username)));
				
				if (userMatch != null && userMatch.Password.Equals(SecurityHelper.EncryptPassword(user.Password, userMatch.Salt)))
				{
					var jwt = TokenHelper.GenerateToken(user.Username, AppSettingsModel.AppSettings.JwtSecret, string.Empty);

					CookieHelper.AddCookie(response, "Authorization-Token", jwt);

					return new DTO<List<string>>()
					{
						Success = true,
						Data = new List<string>() { jwt }
					};
				}
				else
				{
					throw new Exception("Username or Password is incorrect.");
				}
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DTO<List<string>>> RegisterUser(User user, HttpResponse response)
		{
			try
			{
				var users = await _userDAO.GetAll();

				if (string.IsNullOrEmpty(user.Email) && string.IsNullOrEmpty(user.Phone))
				{
					throw new Exception("Email OR Phone is required.");
				}
				if (users.Data.Any(u => u.Email.EqualsIgnoreCase(user.Email)))
				{
					throw new Exception("Email is already in use. Please try again.");
				}
				else if (users.Data.Any(u => u.Username.EqualsIgnoreCase(user.Username)))
				{
					throw new Exception("Username is already taken. Please try again.");
				}
				else
				{
					var salt = SecurityHelper.GenerateSalt();
					var securePassword = SecurityHelper.EncryptPassword(user.Password, salt);

					user.Password = securePassword;
					user.Salt = salt;

					await _userDAO.Add(user);
					var jwt = TokenHelper.GenerateToken(user.Email ?? user.Phone, AppSettingsModel.AppSettings.JwtSecret, string.Empty);

					CookieHelper.AddCookie(response, "Authorization-Token", jwt);

					return new DTO<List<string>>()
					{
						Success = true,
						Data = new List<string>() { jwt }
					};
				}
			}
			catch (Exception e)
			{
				throw e;
			}
		}
	}
}