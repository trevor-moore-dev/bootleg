
// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

namespace Bootleg.Models.DTO
{
	/// <summary>
	/// DTO class that encapsulates a generic object. DTO will get returned from and passed in to API endpoints. Extends the Status object.
	/// </summary>
	/// <typeparam name="T">Generic object "T".</typeparam>
	public class DTO<T> : Status
	{
		public string Id { get; set; }
		public T Data { get; set; }
	}
}
