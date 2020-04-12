using Bootleg.Models.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

// Trevor Moore
// CST-451
// 2/7/2020
// This is my own work.

namespace Bootleg.Models.Documents
{
	/// <summary>
	/// Message object that represents direct messages sent between Users in Conversations.
	/// </summary>
	public class Message
	{
		/// <summary>
		/// The id as a string of the Message object.
		/// </summary>
		[Description("The id as a string of the Message object.")]
		[BsonRequired]
		public string Id { get; set; }
		/// <summary>
		/// The userid as a string of the user who sent the Message object. Use this to search for Users in the User index.
		/// </summary>
		[Description("The userid as a string of the user who sent the Message object. Use this to search for Users in the User index.")]
		[BsonRequired]
		public string UserId { get; set; }
		/// <summary>
		/// The username of the User who sent the Message.
		/// </summary>
		[Description("The username of the User who sent the Message.")]
		public string Username { get; set; }
		/// <summary>
		/// The URI of the User's profile picture who sent the Message.
		/// </summary>
		[Description("The URI of the User's profile picture who sent the Message.")]
		public string ProfilePicUri { get; set; }
		/// <summary>
		/// The contentid as a string of the Content that was sent with the Message. Use this to search for the Content in the Content index.
		/// </summary>
		[Description("The contentid as a string of the Content that was sent with the Message. Use this to search for the Content in the Content index.")]
		public string ContentId { get; set; }
		/// <summary>
		/// The data that the Message was sent as a DateTime object in UTC format.
		/// </summary>
		[Description("The data that the Message was sent as a DateTime object in UTC format.")]
		public DateTime DatePostedUTC { get; set; }
		/// <summary>
		/// The text body of the Message sent. Has a min of 1 and a max of 200.
		/// </summary>
		[Description("The body of the Message sent. Has a min of 1 and a max of 200.")]
		[Required]
		[BsonRequired]
		[StringLength(200, MinimumLength = 1, ErrorMessage = "Please enter a message.")]
		public string MessageBody { get; set; }
		/// <summary>
		/// The URI of the media that was sent with the Message.
		/// </summary>
		[Description("The URI of the media that was sent with the Message.")]
		public string MediaUri { get; set; }
		/// <summary>
		/// The Blob reference to the URI that is stored in Azure Blob storage. Use this to delete blobs from storage.
		/// </summary>
		[Description("The Blob reference to the URI that is stored in Azure Blob storage. Use this to delete blobs from storage.")]
		public string BlobReference { get; set; }
		/// <summary>
		/// The enum MediaType of the MediaUri that was sent with the Message. Will either be Image (0) or Video (1).
		/// </summary>
		[Description("The enum MediaType of the MediaUri that was sent with the Message. Will either be Image (0) or Video (1).")]
		public MediaType MediaType { get; set; }
		/// <summary>
		/// The number of likes that the Content has as an integer.
		/// </summary>
		[Description("The number of likes that the Message has as an integer.")]
		public int Likes { get; set; }
		/// <summary>
		/// The number of dislikes that the Content has as an integer.
		/// </summary>
		[Description("The number of dislikes that the Message has as an integer.")]
		public int Dislikes { get; set; }
	}
}
