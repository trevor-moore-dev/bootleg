using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bootleg.Services.Business.Interfaces
{
	public interface IUserService
	{
		Task<DTO<List<User>>> GetAllUsers();
		Task<DTO<User>> GetUser(string userID);
		Task<DTO<User>> UpdateUser(User currentUser, Tuple<CloudBlockBlob, string> blobReferenence = null);
		Task<DTO<User>> DeleteUser(string userID);
	}
}