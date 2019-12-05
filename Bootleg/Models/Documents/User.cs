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
		public string Username { get; set; }
		[Required]
		[BsonRequired]
		public string Password { get; set; }
		[EmailAddress]
		public string Email { get; set; }
		[Phone]
		public string Phone { get; set; }
		[Required]
		[BsonRequired]
		public string Salt { get; set; }
	}
}