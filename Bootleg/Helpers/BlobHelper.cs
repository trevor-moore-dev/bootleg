using Bootleg.Extensions;
using Bootleg.Models.Enums;
using System;
using System.IO;

// Trevor Moore
// CST-451
// 2/7/2020
// This is my own work.

namespace Bootleg.Helpers
{
    /// <summary>
    /// Blob helper class for Blob related tasks that don't deal with data access/persistence.
    /// </summary>
	public class BlobHelper
	{
        /// <summary>
        /// Method for getting a random storage reference name for a Blob.
        /// </summary>
        /// <param name="filename">The name of the file.</param>
        /// <returns>String of the reference for the file to be stored in the database (so that we can delete the blob later if need be).</returns>
        public static string GetRandomBlobName(string filename)
        {
            // Get the file's extension:
            string ext = Path.GetExtension(filename);
            // Create a reference for it:
            return string.Format("{0:10}_{1}{2}", DateTime.Now.Ticks, Guid.NewGuid(), ext);
        }
        /// <summary>
        /// Method for getting the MediaType enum of a file based off of it's extension.
        /// </summary>
        /// <param name="filename">The name of the file.</param>
        /// <returns>MediaType enum (either Image or Video).</returns>
        public static MediaType GetMediaType(string filename)
        {
            // Get the file's extension:
            string ext = Path.GetExtension(filename);
            // If it equals jpg, jpeg, img, or png, then return Image enum:
            if (ext.EqualsIgnoreCase(".jpg") || ext.EqualsIgnoreCase(".jpeg") || ext.EqualsIgnoreCase(".img") || ext.EqualsIgnoreCase(".png"))
            {
                return MediaType.Image;
            }
            // Else it's a Video:
            else
            {
                return MediaType.Video;
            }
        }
    }
}
