using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bootleg.Services.Business
{
	public class ConversationService : IConversationService
	{
		public Task<DTO<Conversation>> CreateConversation(List<User> users)
		{
			throw new System.NotImplementedException();
		}

		public Task<Message> CreateMessage(HttpRequest request)
		{
			throw new System.NotImplementedException();
		}

		public Task<DTO<Conversation>> DeleteConversation(string conversationId)
		{
			throw new System.NotImplementedException();
		}

		public Task<DTO<Conversation>> DeleteMessage(string conversationId, string messageId)
		{
			throw new System.NotImplementedException();
		}

		public Task<DTO<List<Conversation>>> GetAllConversations(string userID)
		{
			throw new System.NotImplementedException();
		}

		public Task<DTO<Conversation>> GetConversation(string conversationId)
		{
			throw new System.NotImplementedException();
		}

		public Task<DTO<Conversation>> SendMessage(Message message)
		{
			throw new System.NotImplementedException();
		}
	}
}
