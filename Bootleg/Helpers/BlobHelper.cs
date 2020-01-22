using Bootleg.Extensions;
using System;
using System.IO;

// Trevor Moore
// CST-451
// 1/16/2019
// This is my own work.

namespace Bootleg.Helpers
{
	public class BlobHelper
	{
        /// <summary> 
        /// string GetRandomBlobName(string filename): Generates a unique random file name to be uploaded  
        /// </summary> 
        public static string GetRandomBlobName(string filename)
        {
            string ext = Path.GetExtension(filename);
            var uri = string.Format("{0:10}_{1}{2}", DateTime.Now.Ticks, Guid.NewGuid(), ext);

            // this is the randomly generated file name that we will store in the db to associate with a user's post, etc.
            return uri;
        }
        /// <summary> 
        /// string GetRandomBlobName(string filename): Generates a unique random file name to be uploaded  
        /// </summary> 
        public static bool BlobIsImage(string filename)
        {
            string ext = Path.GetExtension(filename);

            if (ext.EqualsIgnoreCase(".jpg") || ext.EqualsIgnoreCase(".jpeg") || ext.EqualsIgnoreCase(".img") || ext.EqualsIgnoreCase(".png"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
