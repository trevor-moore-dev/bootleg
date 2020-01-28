using Microsoft.AspNetCore.Http;
using System.IO;

namespace Bootleg.Helpers
{
	public class ImageHelper
	{
		public static string GetServerImagePath(string imageFileName)
		{
			return $"Resources/Images/{imageFileName}";
		}
	}
}
