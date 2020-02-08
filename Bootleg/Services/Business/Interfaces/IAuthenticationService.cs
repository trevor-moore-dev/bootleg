using Microsoft.AspNetCore.Http;
using Bootleg.Models;
using Bootleg.Models.DTO;
using System.Threading.Tasks;
using System.Collections.Generic;
using Bootleg.Models.Documents;

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

namespace Bootleg.Services.Business.Interfaces
{
	/// <summary>
	/// Interface for defining the contract of the authentication service.
	/// </summary>
	public interface IAuthenticationService
	{
		/// <summary>
		/// Method for authenticating Google OAuth tokens.
		/// </summary>
		/// <param name="token">Token as type of TokenModel.</param>
		/// <param name="httpContext">Context as type of HttpContext.</param>
		/// <returns>DTO encapsulating a list of strings of validated token.</returns>
		Task<DTO<List<string>>> AuthenticateGoogleToken(TokenModel token, HttpContext httpContext);
		/// <summary>
		/// Method for authenticating JWTs.
		/// </summary>
		/// <param name="token">Token as type of string.</param>
		/// <param name="secretKey">SecretKey as type of string.</param>
		/// <returns>DTO encapsulating a list of strings of validated token.</returns>
		DTO<List<string>> AuthenticateToken(string token, string secretKey);
		/// <summary>
		/// Method for logging in a user.
		/// </summary>
		/// <param name="user">User as type of User.</param>
		/// <param name="httpContext">Context as type of HttpContext.</param>
		/// <returns>DTO encapsulating a list of strings of validated token.</returns>
		Task<DTO<List<string>>> AuthenticateUser(User user, HttpContext httpContext);
		/// <summary>
		/// Method for registering a user into the db.
		/// </summary>
		/// <param name="user">User as type of User.</param>
		/// <param name="httpContext">Context as type of HttpContext.</param>
		/// <returns>DTO encapsulating a list of strings of validated token.</returns>
		Task<DTO<List<string>>> RegisterUser(User user, HttpContext httpContext);
	}
}