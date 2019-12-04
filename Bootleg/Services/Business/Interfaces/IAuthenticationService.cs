using Microsoft.AspNetCore.Http;
using Bootleg.Models;
using Bootleg.Models.DTO;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Bootleg.Services.Business.Interfaces
{
	public interface IAuthenticationService
	{
		Task<DTO<List<string>>> AuthenticateGoogleToken(TokenModel token, HttpResponse response);
		DTO<List<string>> AuthenticateToken(string token, string secretKey);
	}
}
