using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel;

// Trevor Moore
// CST-451
// 2/7/2020
// This is my own work.

namespace Bootleg.Models.Documents
{
	/// <summary>
	/// Conversation object that represents a chat between multiple Users.
	/// </summary>
	public class Conversation
	{
		/// <summary>
		/// The id as a string of the Conversation object, which is stored in the db and used for the Conversation index.
		/// </summary>
		[Description("The id as a string of the Conversation object, which is stored in the db and used for the Conversation index.")]
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }
		/// <summary>
		/// The Users who are in the conversation as a List of User objects.
		/// </summary>
		[Description("The Users who are in the conversation as a List of User objects.")]
		[BsonRequired]
		public List<User> Users { get; set; }
		/// <summary>
		/// The data that the Conversation was posted as a DateTime object in UTC format.
		/// </summary>
		[Description("The data that the Content was posted as a DateTime object in UTC format.")]
		public DateTime DatePostedUTC { get; set; }
		/// <summary>
		/// The Messages in the Conversation as a List of Message objects.
		/// </summary>
		[Description("The Messages in the Conversation as a List of Message objects.")]
		public List<Message> Messages { get; set; }
	}
}
