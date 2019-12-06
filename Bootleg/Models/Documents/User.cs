using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Bootleg.Models.Documents
{
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
		public string Salt { get; set; }
	}
}