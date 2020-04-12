
// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

using System.ComponentModel;

namespace Bootleg.Models
{
	/// <summary>
	/// Token class for encapsulating tokens passed to and from APIs.
	/// </summary>
	public class TokenModel
	{
		/// <summary>
		/// String that will the token id of requests.
		/// </summary>
		[Description("String that will the token id of requests.")]
		public string TokenId { get; set; }
	}
}
