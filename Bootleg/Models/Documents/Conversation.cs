﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace Bootleg.Models.Documents
{
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
