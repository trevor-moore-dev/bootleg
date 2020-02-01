using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bootleg.Services.Business.Interfaces
{
	public interface IUserService
	{
		Task<DTO<List<User>>> SearchAllUsers(string username);
		Task<DTO<User>> GetUser(string userID);
		Task<DTO<User>> FollowUser(User user, string userId);
		Task<DTO<User>> UnfollowUser(User user, string userId);
		Task<DTO<User>> UpdateUser(User currentUser);
		Task<DTO<User>> UpdateUserProfile(User currentUser, HttpRequest request, HttpContext httpContext);
		Task<DTO<User>> DeleteUser(string userID);
	}
}