using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

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
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }
		[BsonRequired]
		public List<User> Users { get; set; }
		public DateTime DatePostedUTC { get; set; }
		public List<Message> Messages { get; set; }
	}
}
