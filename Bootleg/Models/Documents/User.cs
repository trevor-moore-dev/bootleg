using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using System.ComponentModel;
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
		/// <summary>
		/// The id as a string of the User object, which is stored in the db and used for the User index.
		/// </summary>
		[Description("The id as a string of the User object, which is stored in the db and used for the User index.")]
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }
		/// <summary>
		/// The username of the User as a string.
		/// </summary>
		[Description("The username of the User as a string.")]
		[Required]
		[BsonRequired]
		[StringLength(25, MinimumLength = 1, ErrorMessage = "The Username field must have a minimum of 1 character, and a max of 25.")]
		public string Username { get; set; }
		/// <summary>
		/// This password of the User as a string. This is encrypted.
		/// </summary>
		[Description("This password of the User as a string. This is encrypted.")]
		[Required]
		[BsonRequired]
		[StringLength(25, MinimumLength = 8, ErrorMessage = "The Password field must have a minimum of 8 characters, and a max of 25.")]
		public string Password { get; set; }
		/// <summary>
		/// This email of the User as a string.
		/// </summary>
		[Description("This email of the User as a string.")]
		[EmailAddress]
		public string Email { get; set; }
		/// <summary>
		/// This Salt of the User as a byte array. This is used to encrypt passwords.
		/// </summary>
		[Description("This Salt of the User as a byte array. This is used to encrypt passwords.")]
		[BsonRequired]
		public byte[] Salt { get; set; }
		/// <summary>
		/// This bio of the User as a string.
		/// </summary>
		[Description("This bio of the User as a string.")]
		public string Bio { get; set; }
		/// <summary>
		/// This URI of the User's profile picture as a string.
		/// </summary>
		[Description("This URI of the User's profile picture as a string.")]
		public string ProfilePicUri { get; set; }
		/// <summary>
		/// The Blob reference to the URI that is stored in Azure Blob storage. Use this to delete blobs from storage.
		/// </summary>
		[Description("The Blob reference to the URI that is stored in Azure Blob storage. Use this to delete blobs from storage.")]
		public string BlobReference { get; set; }
		/// <summary>
		/// The ids of the Users that the current User is following as a List of string. Use them to search for the Users in the User index.
		/// </summary>
		[Description("The ids of the Users that the current User is following as a List of string. Use them to search for the Users in the User index.")]
		public List<string> FollowingIds { get; set; }
		/// <summary>
		/// The ids of the Users that are following the current User as a List of string. Use them to search for the Users in the User index.
		/// </summary>
		[Description("The ids of the Users that are following the current User as a List of string. Use them to search for the Users in the User index.")]
		public List<string> FollowerIds { get; set; }
		/// <summary>
		/// The ids of the Content that the User has posted as a List of string. Use them to search for the Content in the Content index.
		/// </summary>
		[Description("The ids of the Content that the User has posted as a List of string. Use them to search for the Content in the Content index.")]
		public List<string> PostedContentIds { get; set; }
		/// <summary>
		/// The ids of the Content that the User has saved as a List of string. Use them to search for the Content in the Content index.
		/// </summary>
		[Description("The ids of the Content that the User has saved as a List of string. Use them to search for the Content in the Content index.")]
		public List<string> SavedContentIds { get; set; }
		/// <summary>
		/// The ids of the Content that the User has liked as a List of string. Use them to search for the Content in the Content index.
		/// </summary>
		[Description("The ids of the Content that the User has liked as a List of string. Use them to search for the Content in the Content index.")]
		public List<string> LikedContentIds { get; set; }
		/// <summary>
		/// The ids of the Content that the User has disliked as a List of string. Use them to search for the Content in the Content index.
		/// </summary>
		[Description("The ids of the Content that the User has disliked as a List of string. Use them to search for the Content in the Content index.")]
		public List<string> DislikedContentIds { get; set; }
		/// <summary>
		/// The ids of the Conversations that the User has as a List of string. Use them to search for the Conversations in the Conversation index.
		/// </summary>
		[Description("The ids of the Conversations that the User has as a List of string. Use them to search for the Conversations in the Conversation index.")]
		public List<string> DirectMessageIds { get; set; }
	}
}