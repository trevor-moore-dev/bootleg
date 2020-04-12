using Bootleg.Models.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

// Trevor Moore
// CST-451
// 2/7/2020
// This is my own work.

namespace Bootleg.Models.Documents
{
	/// <summary>
	/// Content object that represents posted content on the app.
	/// </summary>
	public class Content
	{
		/// <summary>
		/// The id as a string of the Content object, which is stored in the db and used for the Content index.
		/// </summary>
		[Description("The id of the Content object, which is stored in the db and used for the index.")]
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }
		/// <summary>
		/// The userid as a string of the user who posted the Content object. Use this to search for Users in the User index.
		/// </summary>
		[Description("The userid as a string of the user who posted the Content object. Use this to search for Users in the User index.")]
		[BsonRequired]
		public string UserId { get; set; }
		/// <summary>
		/// The data that the Content was posted as a DateTime object in UTC format.
		/// </summary>
		[Description("The data that the Content was posted as a DateTime object in UTC format.")]
		public DateTime DatePostedUTC { get; set; }
		/// <summary>
		/// The username of the User who posted the Content.
		/// </summary>
		[Description("The username of the User who posted the Content.")]
		public string UserName { get; set; }
		/// <summary>
		/// The URI of the User's profile picture who posted the Content.
		/// </summary>
		[Description("The URI of the User's profile picture who posted the Content.")]
		public string UserProfilePicUri { get; set; }
		/// <summary>
		/// The text body of the Content posted. Has a min of 1 and a max of 200.
		/// </summary>
		[Description("The body of the Content posted. Has a min of 1 and a max of 200.")]
		[Required]
		[BsonRequired]
		[StringLength(200, MinimumLength = 1, ErrorMessage = "Content body must have a minimum of 1 character, and a max of 200.")]
		public string ContentBody { get; set; }
		/// <summary>
		/// The URI of the media that was posted with the Content.
		/// </summary>
		[Description("The URI of the media that was posted with the Content.")]
		public string MediaUri { get; set; }
		/// <summary>
		/// The Blob reference to the URI that is stored in Azure Blob storage. Use this to delete blobs from storage.
		/// </summary>
		[Description("The Blob reference to the URI that is stored in Azure Blob storage. Use this to delete blobs from storage.")]
		public string BlobReference { get; set; }
		/// <summary>
		/// The enum MediaType of the MediaUri that was posted with the Content. Will either be Image (0) or Video (1).
		/// </summary>
		[Description("The enum MediaType of the MediaUri that was posted with the Content. Will either be Image (0) or Video (1).")]
		public MediaType MediaType { get; set; }
		/// <summary>
		/// The number of likes that the Content has as an integer.
		/// </summary>
		[Description("The number of likes that the Content has as an integer.")]
		public int Likes { get; set; }
		/// <summary>
		/// The number of dislikes that the Content has as an integer.
		/// </summary>
		[Description("The number of dislikes that the Content has as an integer.")]
		public int Dislikes { get; set; }
		/// <summary>
		/// The Comments on the posted as a List of Content.
		/// </summary>
		[Description("The Comments on the posted as a List of Content.")]
		public List<Content> Comments { get; set; }
		/// <summary>
		/// This is to be used client-side in order to determine what the user is actively liking. It is not used for anything on the backend.
		/// </summary>
		[Description("This is to be used client-side in order to determine what the user is actively liking. It is not used for anything on the backend.")]
		public bool ActiveLike { get; set; }
		/// <summary>
		/// This is to be used client-side in order to determine what the user is actively disliking. It is not used for anything on the backend.
		/// </summary>
		[Description("This is to be used client-side in order to determine what the user is actively disliking. It is not used for anything on the backend.")]
		public bool ActiveDislike { get; set; }
	}
}