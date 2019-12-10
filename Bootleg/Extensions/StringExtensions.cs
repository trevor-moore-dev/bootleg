using System;

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

namespace Bootleg.Extensions
{
	/// <summary>
	/// String extension class for all string extension methods.
	/// </summary>
	public static class StringExtensions
	{
		/// <summary>
		/// Method will apply the OrdinalIgnoreCase string comparison to the strings. This method is null safe.
		/// </summary>
		/// <param name="string">The invoking string.</param>
		/// <param name="comparison">The string being compared to the invoking string.</param>
		/// <returns>Boolean indicating whether or not the strings are equal.</returns>
		public static bool EqualsIgnoreCase(this string @string, string @comparison)
		{
			// If the invoking string or the comparison string is null, return false.
			if (string.IsNullOrEmpty(@string) || string.IsNullOrEmpty(@comparison))
			{
				return false;
			}
			// else return the result of the string comparison, applying the OrdinalIgnoreCase equality comparer.
			return @string.Equals(@comparison, StringComparison.OrdinalIgnoreCase);
		}
	}
}