using Bootleg.Models.DTO;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bootleg.Services.Business.Interfaces
{
	public interface IBlobService
	{
		Task<Uri> UploadBlob(IFormFile formFile);
		Task<DTO<List<Uri>>> GetAllBlobs();
		Task<DTO<Uri>> GetBlob(string blobReference);
		Task<DTO<Uri>> DeleteBlob(string blobReference);
	}
}
