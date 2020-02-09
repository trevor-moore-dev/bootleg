using Bootleg.Helpers;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Trevor Moore
// CST-451
// 2/7/2020
// This is my own work.

namespace Bootleg.Services.Business
{
    /// <summary>
    /// Blob service for all tasks related to Blob Storage. Implements IBlobService.
    /// </summary>
	public class BlobService : IBlobService
	{
        // Private readonly CloudBlobContainer to connect to in Azure Blob Storage:
        private readonly CloudBlobContainer _blobContainer;
        /// <summary>
        /// Constructor for injecting what we need.
        /// </summary>
        /// <param name="blobConnectionString">String connection to Azure Blob Storage Container.</param>
        /// <param name="blobStorageContainerName">String name of the container.</param>
        public BlobService(string blobConnectionString, string blobStorageContainerName)
        {
            // Surround with try/catch:
            try
            {
                var storageAccount = CloudStorageAccount.Parse(blobConnectionString);
                var cloudBlobClient = storageAccount.CreateCloudBlobClient();
                _blobContainer = cloudBlobClient.GetContainerReference(blobStorageContainerName);
            }
            // Catch any exceptions:
            catch (Exception e)
            {
                // Log the exception:
                LoggerHelper.Log(e);
                // Throw the exception:
                throw e;
            }
        }
        /// <summary>
		/// Method for uploading a blob connected to Content.
		/// </summary>
		/// <param name="request">HttpRequest of the current request.</param>
		/// <returns>Content object.</returns>
        public async Task<Content> UploadContentBlob(HttpRequest request)
        {
            // Surround with try/catch:
            try
            {
                // Instantiate new Content:
                var content = new Content();
                // If request's form contains any elements:
                if (request.Form.Any())
                {
                    // If the form has any files:
                    if (request.Form.Files.Count > 0 && request.Form.Files[0].Length > 0)
                    {
                        // Upload the blob and set the data for the new Content:
                        var blob = await UploadBlob(request);
                        content.MediaUri = blob.Item1.Uri.ToString();
                        content.BlobReference = blob.Item2;
                        content.MediaType = BlobHelper.GetMediaType(request.Form.Files[0].FileName);
                    }
                    // If the form has contentBody key set that data:
                    if (request.Form.Keys.Contains("contentBody"))
                    {
                        content.ContentBody = request.Form["contentBody"];
                    }
                    // Return the new content:
                    return content;
                }
                // Else throw exception that will get caught:
                else
                {
                    throw new Exception("Request did not contain a token.");
                }
            }
            // Catch any exceptions:
            catch (Exception e)
            {
                // Log the exception:
                LoggerHelper.Log(e);
                // Throw the exception:
                throw e;
            }
        }
        /// <summary>
		/// Method for uploading a blob connected to a Message.
		/// </summary>
		/// <param name="request">HttpRequest of the current request.</param>
		/// <returns>Message object.</returns>
        public async Task<Message> UploadMessageBlob(HttpRequest request)
        {
            // Surround with try/catch:
            try
            {
                // Create new Message:
                var message = new Message();
                // If form has any elements:
                if (request.Form.Any())
                {
                    // If form has any files:
                    if (request.Form.Files.Count > 0 && request.Form.Files[0].Length > 0)
                    {
                        // Upload the blob and set the data for the Message:
                        var blob = await UploadBlob(request);
                        message.MediaUri = blob.Item1.Uri.ToString();
                        message.BlobReference = blob.Item2;
                        message.MediaType = BlobHelper.GetMediaType(request.Form.Files[0].FileName);
                    }
                }
                // Return the new message:
                return message;
            }
            // Catch any exceptions:
            catch (Exception e)
            {
                // Log the exception:
                LoggerHelper.Log(e);
                // Throw the exception:
                throw e;
            }
        }
        /// <summary>
		/// Method for deleting old profile pic of User and uploading a new one for their profile pic.
		/// </summary>
		/// <param name="user">User of the current user.</param>
		/// <param name="request">HttpRequest of the current request.</param>
		/// <returns>User object.</returns>
        public async Task<User> UpdateUserProfilePic(User user, HttpRequest request)
        {
            // Surround with try/catch:
            try
            {
                // If the form has any files:
                if (request.Form.Files.Count > 0 && request.Form.Files[0].Length > 0)
                {
                    // Upload the blob:
                    var blob = await UploadBlob(request);
                    // Delete the old blob reference:
                    if (!string.IsNullOrEmpty(user.BlobReference))
                    {
                        await DeleteBlob(user.BlobReference);
                    }
                    // Update the User with the new blob reference:
                    user.ProfilePicUri = blob.Item1.Uri.ToString();
                    user.BlobReference = blob.Item2;
                }
                // Return the updated User object:
                return user;
            }
            // Catch any exceptions:
            catch (Exception e)
            {
                // Log the exception:
                LoggerHelper.Log(e);
                // Throw the exception:
                throw e;
            }
        }
        /// <summary>
		/// Method for uploading a blob to Blob Storage.
		/// </summary>
		/// <param name="request">HttpRequest of the current request.</param>
		/// <returns>Tuple of the CloudBlobBlob uploaded and it's reference string.</returns>
        public async Task<Tuple<CloudBlockBlob, string>> UploadBlob(HttpRequest request)
        {
            // Surround with try/catch:
            try
            {
                // Get the I/O stream of the file:
                using var stream = request.Form.Files[0].OpenReadStream();
                // Create a filename reference for the blob for storage in the database:
                var filenameReference = BlobHelper.GetRandomBlobName(request.Form.Files[0].FileName);
                // Create a BlockBlob:
                var cloudBlockBlob = _blobContainer.GetBlockBlobReference(filenameReference);
                // Upload the BlockBlob to Storage:
                await cloudBlockBlob.UploadFromStreamAsync(stream);
                // Return the result in a Tuple:
                return new Tuple<CloudBlockBlob, string>(cloudBlockBlob, filenameReference);
            }
            // Catch any exceptions:
            catch (Exception e)
            {
                // Log the exception:
                LoggerHelper.Log(e);
                // Throw the exception:
                throw e;
            }
        }
        /// <summary>
		/// Method for getting all blobs in Blob Storage.
		/// </summary>
		/// <returns>DTO containing list of Uri's to all the blobs.</returns>
        public async Task<DTO<List<Uri>>> GetAllBlobs()
        {
            // Set Blob continuation token to null for now:
            BlobContinuationToken continuationToken = null;
            // Instantiate list of Uris and BlobItems:
            var uris = new List<Uri>();
            var allBlobs = new List<IListBlobItem>();
            // Surround with try/catch:
            try
            {
                // List all blobs for each segment while continuation token isn't null:
                do
                {
                    // Get the response:
                    var response = await _blobContainer.ListBlobsSegmentedAsync(continuationToken);
                    // Set continuation token:
                    continuationToken = response.ContinuationToken;
                    // Add the blobs to the list:
                    allBlobs.AddRange(response.Results);
                }
                while (continuationToken != null);
                // Add each blob's Uri to the list of Uri's:
                foreach (IListBlobItem blob in allBlobs)
                {
                    uris.Add(blob.Uri);
                }
                // Return the list of Uri's in a DTO:
                return new DTO<List<Uri>>()
                {
                    Success = true,
                    Data = uris
                };
            }
            // Catch any exceptions:
            catch (Exception e)
            {
                // Log the exception:
                LoggerHelper.Log(e);
                // Throw the exception:
                throw e;
            }
        }
        /// <summary>
		/// Method for getting a blob in Blob Storage based off of it's reference.
		/// </summary>
		/// <param name="blobReference">String of the reference to the blob.</param>
		/// <returns>DTO containing the Uri to the blob.</returns>
        public async Task<DTO<Uri>> GetBlob(string blobReference)
        {
            // Surround with try/catch:
            try
            {
                // Get the blob using it's reference:
                var blob = _blobContainer.GetBlockBlobReference(blobReference);
                // Get the blob's uri:
                var uri = await blob.DownloadTextAsync();
                // Retunr the uri wrapped in DTO:
                return new DTO<Uri>()
                {
                    Success = true,
                    Data = new Uri(uri)
                };
            }
            // Catch any exceptions:
            catch (Exception e)
            {
                // Log the exception:
                LoggerHelper.Log(e);
                // Throw the exception:
                throw e;
            }
        }
        /// <summary>
		/// Method for deleting a blob in Blob Storage.
		/// </summary>
		/// <param name="blobReference">String of the reference to the blob.</param>
		/// <returns>DTO containing a boolean indicating success/failure.</returns>
        public async Task<DTO<bool>> DeleteBlob(string blobReference)
        {
            // Surround with try/catch:
            try
            {
                // Get the blob using it's reference:
                var blob = _blobContainer.GetBlockBlobReference(blobReference);
                // Delete the blob if it exists:
                await blob.DeleteIfExistsAsync();
                // Return success if no exception is thrown:
                return new DTO<bool>()
                {
                    Data = true,
                    Success = true
                };
            }
            // Catch any exceptions:
            catch (Exception e)
            {
                // Log the exception:
                LoggerHelper.Log(e);
                // Throw the exception:
                throw e;
            }
        }
	}
}