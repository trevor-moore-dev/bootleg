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

namespace Bootleg.Services.Business
{
	public class BlobService : IBlobService
	{
        private readonly CloudBlobContainer _blobContainer;

        public BlobService(string blobConnectionString, string blobStorageContainerName)
        {
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

        public async Task<Content> UploadContentBlob(HttpRequest request)
        {
            try
            {
                var content = new Content();

                if (request.Form.Any())
                {
                    if (request.Form.Files.Count > 0 && request.Form.Files[0].Length > 0)
                    {
                        var blob = await UploadBlob(request);
                        content.MediaUri = blob.Item1.Uri.ToString();
                        content.BlobReference = blob.Item2;
                        content.MediaType = BlobHelper.GetMediaType(request.Form.Files[0].FileName);
                    }

                    if (request.Form.Keys.Contains("contentBody"))
                    {
                        content.ContentBody = request.Form["contentBody"];
                    }

                    return content;
                }
                else
                {
                    throw new Exception("Request did not contain a token.");
                }
            }
            catch(Exception e)
            {
                // Log the exception:
                LoggerHelper.Log(e);
                // Throw the exception:
                throw e;
            }
        }

        public async Task<User> UpdateUserProfilePic(User user, HttpRequest request)
        {
            try
            {
                if (request.Form.Files.Count > 0 && request.Form.Files[0].Length > 0)
                {
                    var blob = await UploadBlob(request);

                    if (!string.IsNullOrEmpty(user.BlobReference))
                    {
                        await DeleteBlob(user.BlobReference);
                    }

                    user.ProfilePicUri = blob.Item1.Uri.ToString();
                    user.BlobReference = blob.Item2;
                }

                return user;
            }
            catch (Exception e)
            {
                // Log the exception:
                LoggerHelper.Log(e);
                // Throw the exception:
                throw e;
            }
        }

        public async Task<Tuple<CloudBlockBlob, string>> UploadBlob(HttpRequest request)
        {
            try
            {
                using var stream = request.Form.Files[0].OpenReadStream();
                var filenameReference = BlobHelper.GetRandomBlobName(request.Form.Files[0].FileName);
                var cloudBlockBlob = _blobContainer.GetBlockBlobReference(filenameReference);
                await cloudBlockBlob.UploadFromStreamAsync(stream);
                return new Tuple<CloudBlockBlob, string>(cloudBlockBlob, filenameReference);
            }
            catch (Exception e)
            {
                // Log the exception:
                LoggerHelper.Log(e);
                // Throw the exception:
                throw e;
            }
        }

        public async Task<DTO<List<Uri>>> GetAllBlobs()
        {
            BlobContinuationToken continuationToken = null;
            var uris = new List<Uri>();
            var allBlobs = new List<IListBlobItem>();

            try
            {
                do
                {
                    var response = await _blobContainer.ListBlobsSegmentedAsync(continuationToken);
                    continuationToken = response.ContinuationToken;
                    allBlobs.AddRange(response.Results);
                }
                while (continuationToken != null);

                foreach (IListBlobItem blob in allBlobs)
                {
                    uris.Add(blob.Uri);
                }

                return new DTO<List<Uri>>()
                {
                    Success = true,
                    Data = uris
                };
            }
            catch (Exception e)
            {
                // Log the exception:
                LoggerHelper.Log(e);
                // Throw the exception:
                throw e;
            }
        }

        public async Task<DTO<Uri>> GetBlob(string blobReference)
        {
            try
            {
                var blob = _blobContainer.GetBlockBlobReference(blobReference);
                var uri = await blob.DownloadTextAsync();

                return new DTO<Uri>()
                {
                    Success = true,
                    Data = new Uri(uri)
                };
            }
            catch (Exception e)
            {
                // Log the exception:
                LoggerHelper.Log(e);
                // Throw the exception:
                throw e;
            }
        }

        public async Task<DTO<bool>> DeleteBlob(string blobReference)
        {
            try
            {
                var blob = _blobContainer.GetBlockBlobReference(blobReference);
                await blob.DeleteIfExistsAsync();

                return new DTO<bool>()
                {
                    Data = true,
                    Success = true
                };
            }
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