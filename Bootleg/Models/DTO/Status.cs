using System.Collections.Generic;
using System.ComponentModel;

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

namespace Bootleg.Models.DTO
{
	/// <summary>
	/// Status class that encapsulates the success and errors of API responses.
	/// </summary>
	public class Status
	{
		/// <summary>
		/// Bool indicating whether the request was successful or not.
		/// </summary>
		[Description("Bool indicating whether the request was successful or not.")]
		public bool Success { get; set; }
		/// <summary>
		/// Dictionary that (may) contains errors that can be used to display on the front end, if the request was unsuccessful.
		/// </summary>
		[Description("Dictionary that (may) contains errors that can be used to display on the front end, if the request was unsuccessful.")]
		public Dictionary<string, List<string>> Errors { get; set; } = new Dictionary<string, List<string>>();
	}
}
