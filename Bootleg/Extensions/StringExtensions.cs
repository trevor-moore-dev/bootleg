using System;

namespace Bootleg.Extensions
{
	public static class StringExtensions
	{
		public static bool EqualsIgnoreCase(this string @string, string @comparison)
		{
			if (string.IsNullOrEmpty(@string) || string.IsNullOrEmpty(@comparison))
			{
				return false;
			}

			return @string.Equals(@comparison, StringComparison.OrdinalIgnoreCase);
		}
	}
}