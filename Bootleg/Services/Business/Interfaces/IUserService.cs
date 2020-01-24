using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bootleg.Services.Business.Interfaces
{
	public interface IUserService
	{
		Task<DTO<List<User>>> GetAllUsers();
		Task<DTO<List<User>>> GetUser(string userID);
		Task<DTO<List<User>>> UpdateUser(User currentUser);
		Task<DTO<List<User>>> DeleteEvent(string userID);
	}
}