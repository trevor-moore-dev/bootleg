using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

namespace Bootleg.Models.Documents
{
	/// <summary>
	/// User class that will be stored as a document in the database.
	/// </summary>
	public class User
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }
		[Required]
		[BsonRequired]
		[StringLength(25, MinimumLength = 1, ErrorMessage = "The Username field must have a minimum of 1 character, and a max of 25.")]
		public string Username { get; set; }
		[Required]
		[BsonRequired]
		[StringLength(25, MinimumLength = 8, ErrorMessage = "The Password field must have a minimum of 8 characters, and a max of 25.")]
		public string Password { get; set; }
		[EmailAddress]
		public string Email { get; set; }
		[Phone]
		public string Phone { get; set; }
		[BsonRequired]
		public byte[] Salt { get; set; }
	}
}