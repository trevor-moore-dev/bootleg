using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

// Trevor Moore
// CST-451
// 2/7/2019
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
		public string ConversationName { get; set; } = "Group Conversation";
		public List<Message> Messages { get; set; }
	}
}
