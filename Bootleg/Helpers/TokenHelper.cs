using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Bootleg.Models;

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

namespace Bootleg.Helpers
{
	/// <summary>
	/// Token helper class for all "helper" methods concerning JWTs.
	/// </summary>
    public class TokenHelper
    {
		/// <summary>
		/// Method for generating a JWT encrypted and signed by Bootleg, required for logged-in use of Bootleg.
		/// </summary>
		/// <param name="email">Email as string.</param>
		/// <param name="secret">Secret (which is the secret key used for encrypting/decrypting the token) as string.</param>
		/// <param name="id">Id of the object as a string.</param>
		/// <returns>Token as a string.</returns>
		public static string GenerateToken(string email, string secret, string id, string profileUri)
        {
			// Initialize claims of of the JWT using the email, a Guid, id, and the profile pic uri:
			var claims = new[]
			{
				new Claim(JwtRegisteredClaimNames.Sub, email ?? string.Empty),
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
				new Claim(JwtRegisteredClaimNames.Azp, id ?? string.Empty),
				new Claim(JwtRegisteredClaimNames.Aud, profileUri ?? string.Empty)
			};
			// Initialize the key of the JWT using the bytes of the secret key passed in:
			var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));
			// Initialize the credentials using the key:
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
			// Create token using the claims and credentials:
			var token = new JwtSecurityToken
			(
				AppSettingsModel.AppSettings.AppDomain,
				AppSettingsModel.AppSettings.AppAudience,
				claims,
				expires: DateTime.UtcNow.AddMonths(1),
				signingCredentials: creds
			);
			// Return the serialized JWT:
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}