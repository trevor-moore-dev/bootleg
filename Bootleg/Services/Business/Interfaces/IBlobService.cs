using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// Trevor Moore
// CST-451
// 2/7/2019
// This is my own work.

namespace Bootleg.Services.Business.Interfaces
{
	/// <summary>
	/// Interface for defining contract for Blob service.
	/// </summary>
	public interface IBlobService
	{
		/// <summary>
		/// Method for uploading a blob connected to Content.
		/// </summary>
		/// <param name="request">HttpRequest of the current request.</param>
		/// <returns>Content object.</returns>
		Task<Content> UploadContentBlob(HttpRequest request);
		/// <summary>
		/// Method for uploading a blob connected to a Message.
		/// </summary>
		/// <param name="request">HttpRequest of the current request.</param>
		/// <returns>Message object.</returns>
		Task<Message> UploadMessageBlob(HttpRequest request);
		/// <summary>
		/// Method for uploading a blob to Blob Storage.
		/// </summary>
		/// <param name="request">HttpRequest of the current request.</param>
		/// <returns>Tuple of the CloudBlobBlob uploaded and it's reference string.</returns>
		Task<Tuple<CloudBlockBlob, string>> UploadBlob(HttpRequest request);
		/// <summary>
		/// Method for deleting old profile pic of User and uploading a new one for their profile pic.
		/// </summary>
		/// <param name="user">User of the current user.</param>
		/// <param name="request">HttpRequest of the current request.</param>
		/// <returns>User object.</returns>
		Task<User> UpdateUserProfilePic(User user, HttpRequest request);
		/// <summary>
		/// Method for getting all blobs in Blob Storage.
		/// </summary>
		/// <returns>DTO containing list of Uri's to all the blobs.</returns>
		Task<DTO<List<Uri>>> GetAllBlobs();
		/// <summary>
		/// Method for getting a blob in Blob Storage based off of it's reference.
		/// </summary>
		/// <param name="blobReference">String of the reference to the blob.</param>
		/// <returns>DTO containing the Uri to the blob.</returns>
		Task<DTO<Uri>> GetBlob(string blobReference);
		/// <summary>
		/// Method for deleting a blob in Blob Storage.
		/// </summary>
		/// <param name="blobReference">String of the reference to the blob.</param>
		/// <returns>DTO containing a boolean indicating success/failure.</returns>
		Task<DTO<bool>> DeleteBlob(string blobReference);
	}
}
