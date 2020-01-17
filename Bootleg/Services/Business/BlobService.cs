using Bootleg.Helpers;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
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

        public async Task<DTO<Uri>> UploadBlob(IFormFile formFile)
        {
            Uri uploadedUri = null;

            try
            {
                if (formFile.Length > 0)
                {
                    using var stream = formFile.OpenReadStream();
                    var filenameReference = BlobHelper.GetRandomBlobName(formFile.FileName);
                    var cloudBlockBlob = _blobContainer.GetBlockBlobReference(filenameReference);
                    await cloudBlockBlob.UploadFromStreamAsync(stream);
                    uploadedUri = cloudBlockBlob.Uri;
                }

                return new DTO<Uri>()
                {
                    Success = true,
                    Data = uploadedUri
                };
            }
            catch(Exception e)
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

        public async Task<DTO<Uri>> DeleteBlob(string blobReference)
        {
            try
            {
                var blob = _blobContainer.GetBlockBlobReference(blobReference);
                var uri = await blob.DownloadTextAsync();
                await blob.DeleteIfExistsAsync();

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
	}
}