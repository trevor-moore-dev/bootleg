using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bootleg.Services.Business.Interfaces
{
	public interface IBlobService
	{
		Task<Content> UploadContentBlob(HttpRequest request);
		Task<Message> UploadMessageBlob(HttpRequest request);
		Task<Tuple<CloudBlockBlob, string>> UploadBlob(HttpRequest request);
		Task<User> UpdateUserProfilePic(User user, HttpRequest request);
		Task<DTO<List<Uri>>> GetAllBlobs();
		Task<DTO<Uri>> GetBlob(string blobReference);
		Task<DTO<bool>> DeleteBlob(string blobReference);
	}
}
