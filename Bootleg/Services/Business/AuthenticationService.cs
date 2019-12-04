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

namespace Bootleg.Services.Business.Interfaces
{
	public class AuthenticationService : IAuthenticationService
	{
		public async Task<DTO<List<string>>> AuthenticateGoogleToken(TokenModel token, HttpResponse response)
		{
			try
			{
				var payload = await GoogleJsonWebSignature.ValidateAsync(token.TokenId, new GoogleJsonWebSignature.ValidationSettings());
				var jwt = TokenHelper.GenerateToken(payload.Email, AppSettingsModel.AppSettings.JwtSecret, string.Empty);

				LoggerHelper.Log(payload.ExpirationTimeSeconds.ToString());
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
	}
}