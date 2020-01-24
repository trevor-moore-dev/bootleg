using Bootleg.Models.Enums;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace Bootleg.Models.Documents
{
	public class Message
	{
		[BsonRequired]
		public string UserId { get; set; }
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
