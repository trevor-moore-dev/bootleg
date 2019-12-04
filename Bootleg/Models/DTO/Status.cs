using System.Collections.Generic;

namespace Bootleg.Models.DTO
{
	public class Status
	{
		public bool Success { get; set; }
		public Dictionary<string, List<string>> Errors { get; set; } = new Dictionary<string, List<string>>();
	}
}
