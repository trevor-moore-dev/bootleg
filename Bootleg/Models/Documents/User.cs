using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
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
		[BsonRequired]
		public byte[] Salt { get; set; }
		public string Bio { get; set; }
		public string ProfilePicUri { get; set; }
		public string BlobReference { get; set; }
		public List<string> FollowingIds { get; set; }
		public List<string> FollowerIds { get; set; }
		public List<string> PostedContentIds { get; set; }
		public List<string> SavedContentIds { get; set; }
		public List<string> LikedContentIds { get; set; }
		public List<string> DislikedContentIds { get; set; }
		public List<string> DirectMessageIds { get; set; }
	}
}