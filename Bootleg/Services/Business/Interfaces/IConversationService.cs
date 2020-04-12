using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

// Trevor Moore
// CST-451
// 2/8/2020
// This is my own work.

namespace Bootleg.Services.Business.Interfaces
{
	/// <summary>
	/// Interface for defining conversation service contract.
	/// </summary>
	public interface IConversationService
	{
		/// <summary>
		/// Method for getting all conversations for a user.
		/// </summary>
		/// <param name="userID">String of user id.</param>
		/// <returns>DTO containing list of Conversations.</returns>
		Task<DTO<List<Conversation>>> GetAllConversations(string userID);
		/// <summary>
		/// Method for getting a conversation.
		/// </summary>
		/// <param name="conversationId">String conversation id.</param>
		/// <returns>DTO containing the Conversation.</returns>
		Task<DTO<Conversation>> GetConversation(string conversationId);
		/// <summary>
		/// Method for creating a conversation.
		/// </summary>
		/// <param name="users">List of Users who will be in the Conversation.</param>
		/// <returns>The newly created Conversation object.</returns>
		Task<DTO<Conversation>> CreateConversation(List<User> users);
		/// <summary>
		/// Method for creating a new message.
		/// </summary>
		/// <param name="request">HttpRequest object.</param>
		/// <param name="message">Message object.</param>
		/// <param name="user">User object.</param>
		/// <returns>Returns the instantiated Message with all it's data ready to go.</returns>
		Message CreateMessage(HttpRequest request, Message message, User user);
		/// <summary>
		/// Method for sending a Message.
		/// </summary>
		/// <param name="conversation">Conversation object.</param>
		/// <param name="message">Message object.</param>
		/// <returns>DTO containing the updated Conversation.</returns>
		Task<DTO<Conversation>> SendMessage(Conversation conversation, Message message);
		/// <summary>
		/// Method for deleting a message.
		/// </summary>
		/// <param name="conversation">Conversation object.</param>
		/// <param name="messageId">String message id.</param>
		/// <returns>DTO containing the updated Conversation.</returns>
		Task<DTO<Conversation>> DeleteMessage(Conversation conversation, string messageId);
		/// <summary>
		/// Method for leaving a Conversation.
		/// </summary>
		/// <param name="conversation">Conversation object.</param>
		/// <param name="user">User who is leaving.</param>
		/// <returns>DTO containing the updated Conversation.</returns>
		Task<DTO<Conversation>> LeaveConversation(Conversation conversation, User user);
		/// <summary>
		/// Method for deleting old profile pic of User and uploading a new one for their profile pic.
		/// </summary>
		/// <param name="user">User of the current user.</param>
		/// <returns>bool value.</returns>
		Task<DTO<bool>> UpdateUserProfilePic(User user);
	}
}