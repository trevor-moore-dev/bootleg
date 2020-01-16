using Microsoft.AspNetCore.Http;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Bootleg.Services.Business
{
	public class ContentService
	{
        private string blobConnectionString;
        private string blobStorageContainerName;

        public ContentService(string blobConnectionString, string blobStorageContainerName)
        {
            this.blobConnectionString = blobConnectionString;
            this.blobStorageContainerName = blobStorageContainerName;
        }

        public async Task<bool> Post(List<IFormFile> files)
        {
            var uploadSuccess = false;
            string uploadedUri = null;

            foreach (var formFile in files)
            {
                if (formFile.Length <= 0)
                {
                    continue;
                }
   
                using (var stream = formFile.OpenReadStream())
                {
                    (uploadSuccess, uploadedUri) = await UploadToBlob(formFile.FileName, stream);
                    //TempData["uploadedUri"] = uploadedUri;
                }
            }

            return uploadSuccess;
        }

        private async Task<(bool, string)> UploadToBlob(string filename, Stream stream = null)
        {
            CloudStorageAccount storageAccount;
            CloudBlobContainer cloudBlobContainer = null;

            // Check whether the connection string can be parsed.
            if (CloudStorageAccount.TryParse(this.blobConnectionString, out storageAccount))
            {
                try
                {
                    // Create the CloudBlobClient that represents the Blob storage endpoint for the storage account.
                    CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();

                    // Create a container called 'uploadblob' and append a GUID value to it to make the name unique. 
                    cloudBlobContainer = cloudBlobClient.GetContainerReference(this.blobStorageContainerName);
                    await cloudBlobContainer.CreateIfNotExistsAsync();

                    // Set the permissions so the blobs are public. 
                    BlobContainerPermissions permissions = new BlobContainerPermissions
                    {
                        PublicAccess = BlobContainerPublicAccessType.Blob
                    };
                    await cloudBlobContainer.SetPermissionsAsync(permissions);

                    // Get a reference to the blob address, then upload the file to the blob.
                    var filenameReference = GetRandomBlobName(filename);
                    CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(filenameReference);

                    if (stream != null)
                    {
                        await cloudBlockBlob.UploadFromStreamAsync(stream);
                    }
                    else
                    {
                        return (false, null);
                    }

                    return (true, cloudBlockBlob.SnapshotQualifiedStorageUri.PrimaryUri.ToString());
                }
                catch (StorageException ex)
                {
                    return (false, null);
                }
                finally
                {
                    if (cloudBlobContainer != null)
                    {
                        await cloudBlobContainer.DeleteIfExistsAsync();
                    }
                }
            }
            else
            {
                return (false, null);
            }
        }

        public async Task<List<Uri>> GetAllBlobUris()
        {
            CloudStorageAccount storageAccount;
            CloudBlobContainer cloudBlobContainer = null;
            BlobContinuationToken continuationToken = null;
            var uris = new List<Uri>();

            // Check whether the connection string can be parsed.
            if (CloudStorageAccount.TryParse(this.blobConnectionString, out storageAccount))
            {
                try
                {
                    // Create the CloudBlobClient that represents the Blob storage endpoint for the storage account.
                    CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();

                    // Create a container called 'uploadblob' and append a GUID value to it to make the name unique. 
                    cloudBlobContainer = cloudBlobClient.GetContainerReference(this.blobStorageContainerName);
                    await cloudBlobContainer.CreateIfNotExistsAsync();

                    // Set the permissions so the blobs are public. 
                    BlobContainerPermissions permissions = new BlobContainerPermissions
                    {
                        PublicAccess = BlobContainerPublicAccessType.Blob
                    };
                    await cloudBlobContainer.SetPermissionsAsync(permissions);

                    
                    
                    List<IListBlobItem> allBlobs = new List<IListBlobItem>();
                    do
                    {
                        var response = await cloudBlobContainer.ListBlobsSegmentedAsync(continuationToken);
                        continuationToken = response.ContinuationToken;
                        allBlobs.AddRange(response.Results);
                    }
                    while (continuationToken != null);

                    foreach (IListBlobItem blob in allBlobs)
                    {
                        uris.Add(blob.Uri);
                    }

                    return uris;
                }
                catch (StorageException ex)
                {
                    return null;
                }
                finally
                {
                    if (cloudBlobContainer != null)
                    {
                        await cloudBlobContainer.DeleteIfExistsAsync();
                    }
                }
            }
            else
            {
                return null;
            }
        }

        /// <summary> 
        /// string GetRandomBlobName(string filename): Generates a unique random file name to be uploaded  
        /// </summary> 
        private string GetRandomBlobName(string filename)
        {
            string ext = Path.GetExtension(filename);
            var uri = string.Format("{0:10}_{1}{2}", DateTime.Now.Ticks, Guid.NewGuid(), ext);

            // this is the randomly generated file name that we will store in the db to associate with a user's post, etc.
            return uri;
        }
    }
}
