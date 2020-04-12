
// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

using System.ComponentModel;

namespace Bootleg.Models.DTO
{
	/// <summary>
	/// DTO class that encapsulates a generic object. DTO will get returned from and passed in to API endpoints. Extends the Status object.
	/// </summary>
	/// <typeparam name="T">Generic object "T".</typeparam>
	public class DTO<T> : Status
	{
		/// <summary>
		/// String that carries the id of any particular requested data.
		/// </summary>
		[Description("String that carries the id of any particular requested data.")]
		public string Id { get; set; }
		/// <summary>
		/// The data that the request is encapsulating. It is of a generic type.
		/// </summary>
		[Description("The data that the request is encapsulating. It is of a generic type.")]
		public T Data { get; set; }
	}
}
