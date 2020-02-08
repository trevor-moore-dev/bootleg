using Bootleg.Models.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

// Trevor Moore
// CST-451
// 2/7/2019
// This is my own work.

namespace Bootleg.Models.Documents
{
	/// <summary>
	/// Content object that represents posted content on the app.
	/// </summary>
	public class Content
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }
		[BsonRequired]
		public string UserId { get; set; }
		public DateTime DatePostedUTC { get; set; }
		public string UserName { get; set; }
		public string UserProfilePicUri { get; set; }
		[Required]
		[BsonRequired]
		[StringLength(200, MinimumLength = 1, ErrorMessage = "Content body must have a minimum of 1 character, and a max of 200.")]
		public string ContentBody { get; set; }
		public string MediaUri { get; set; }
		public string BlobReference { get; set; }
		public MediaType MediaType { get; set; }
		public int Likes { get; set; }
		public int Dislikes { get; set; }
		public List<Content> Comments { get; set; }
	}
}