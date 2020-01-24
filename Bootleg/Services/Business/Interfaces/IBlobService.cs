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
		Task<Tuple<Content, string>> UploadContentBlob(IFormCollection form);
		Task<Tuple<CloudBlockBlob, string>> UploadBlob(IFormFile file);
		Task<DTO<List<Uri>>> GetAllBlobs();
		Task<DTO<Uri>> GetBlob(string blobReference);
		Task<DTO<Uri>> DeleteBlob(string blobReference);
	}
}
