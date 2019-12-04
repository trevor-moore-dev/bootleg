using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Bootleg.Models;

namespace Bootleg.Helpers
{
    public class TokenHelper
    {
        public static string GenerateToken(string email, string secret, string eventID)
        {
			var claims = new[]
			{
				new Claim(JwtRegisteredClaimNames.Sub, email),
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
				new Claim(JwtRegisteredClaimNames.Azp, eventID)
			};

			var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var token = new JwtSecurityToken
			(
				AppSettingsModel.AppSettings.AppDomain,
				AppSettingsModel.AppSettings.AppAudience,
				claims,
				expires: DateTime.UtcNow.AddMonths(1),
				signingCredentials: creds
			);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}