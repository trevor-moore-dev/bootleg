
// Trevor Moore
// CST-451
// 2/7/2019
// This is my own work.

namespace Bootleg.Helpers
{
	/// <summary>
	/// Image helper for helping with delivering image resources on the server.
	/// </summary>
	public class ImageHelper
	{
		/// <summary>
		/// Method for getting the filepath on the server of a given image file name.
		/// </summary>
		/// <param name="imageFileName">The full name of the image file whose path we want.</param>
		/// <returns>String of the path to the image.</returns>
		public static string GetServerImagePath(string imageFileName)
		{
			// Return the path:
			return $"Resources/Images/{imageFileName}";
		}
	}
}
