using Microsoft.AspNetCore.Http;
using Bootleg.Models;
using Bootleg.Models.DTO;
using System.Threading.Tasks;
using System.Collections.Generic;
using Bootleg.Models.Documents;

namespace Bootleg.Services.Business.Interfaces
{
	public interface IAuthenticationService
	{
		Task<DTO<List<string>>> AuthenticateGoogleToken(TokenModel token, HttpResponse response);
		DTO<List<string>> AuthenticateToken(string token, string secretKey);
		Task<DTO<List<string>>> AuthenticateUser(User token, HttpResponse response);
		Task<DTO<List<string>>> RegisterUser(User token, HttpResponse response);
	}
}
