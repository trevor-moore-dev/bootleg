using System.Collections.Generic;

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
		public bool Success { get; set; }
		public Dictionary<string, List<string>> Errors { get; set; } = new Dictionary<string, List<string>>();
	}
}
