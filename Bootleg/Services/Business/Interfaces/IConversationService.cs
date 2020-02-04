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
		Message CreateMessage(HttpRequest request, Message message, User user);
		Task<DTO<Conversation>> SendMessage(Conversation conversation, Message message);
		Task<DTO<Conversation>> DeleteMessage(Conversation conversation, string messageId);
		Task<DTO<Conversation>> LeaveConversation(Conversation conversation, User user);
	}
}
