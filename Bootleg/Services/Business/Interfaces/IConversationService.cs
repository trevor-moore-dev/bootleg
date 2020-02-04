using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bootleg.Services.Business.Interfaces
{
	public interface IConversationService
	{
		Task<DTO<List<Conversation>>> GetAllConversations(string userID);
		Task<DTO<Conversation>> GetConversation(string conversationId);
		Task<DTO<Conversation>> CreateConversation(List<User> users);
		Task<Message> CreateMessage(HttpRequest request);
		Task<DTO<Conversation>> SendMessage(Message message);
		Task<DTO<Conversation>> DeleteMessage(string conversationId, string messageId);
		Task<DTO<Conversation>> DeleteConversation(string conversationId);
	}
}
