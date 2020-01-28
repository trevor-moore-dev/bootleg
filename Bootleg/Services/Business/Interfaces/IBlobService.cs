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
		Task<Tuple<CloudBlockBlob, string>> UploadBlob(HttpRequest request);
		Task<DTO<List<Uri>>> GetAllBlobs();
		Task<DTO<Uri>> GetBlob(string blobReference);
		Task<DTO<Uri>> DeleteBlob(string blobReference);
	}
}
