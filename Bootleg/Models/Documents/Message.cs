using Bootleg.Models.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
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
		[BsonRequired]
		public string Id { get; set; }
		[BsonRequired]
		public string UserId { get; set; }
		public string Username { get; set; }
		public string ProfilePicUri { get; set; }
		public string ContentId { get; set; }
		public DateTime DatePostedUTC { get; set; }
		[Required]
		[BsonRequired]
		[StringLength(200, MinimumLength = 1, ErrorMessage = "Please enter a message.")]
		public string MessageBody { get; set; }
		public string MediaUri { get; set; }
		public string BlobReference { get; set; }
		public MediaType MediaType { get; set; }
		public int Likes { get; set; }
		public int Dislikes { get; set; }
	}
}
