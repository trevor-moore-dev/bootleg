using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bootleg.Services.Business.Interfaces
{
	public interface IUserService
	{
		Task<DTO<List<User>>> GetAllUsers();
		Task<DTO<User>> GetUser(string userID);
		Task<DTO<User>> UpdateUser(User currentUser);
		Task<DTO<User>> UpdateUserProfile(User currentUser, HttpRequest request, HttpContext httpContext);
		Task<DTO<User>> DeleteUser(string userID);
	}
}