using Bootleg.Helpers;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Bootleg.Services.Data.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Trevor Moore
// CST-451
// 2/8/2020
// This is my own work.

namespace Bootleg.Services.Business
{
	/// <summary>
	/// Conversation service class for all tasks related to conversations. Implements IConversationService.
	/// </summary>
	public class ConversationService : IConversationService
	{
		// Private readonly data access object to be injected:
		private readonly IDAO<Conversation> _conversationDAO;
		/// <summary>
		/// Constructor that will instantiate our dependencies that get injected by the container.
		/// </summary>
		/// <param name="_conversationDAO">DAO to be injected.</param>
		public ConversationService(IDAO<Conversation> _conversationDAO)
		{
			// Set our dependencies:
			this._conversationDAO = _conversationDAO;
		}
		/// <summary>
		/// Method for creating a conversation.
		/// </summary>
		/// <param name="users">List of Users who will be in the Conversation.</param>
		/// <returns>The newly created Conversation object.</returns>
		public async Task<DTO<Conversation>> CreateConversation(List<User> users)
		{
			// Surround with try/catch:
			try
			{
				// Get all conversations:
				var conversations = await _conversationDAO.GetAll();
				// Get all conversations for the first user:
				var user1Convos = conversations?.Where(convo => convo?.Users?.Any(user => user.Id.Equals(users[0].Id)) == true)?.ToList() ?? new List<Conversation>();
				// See if that user already has a conversation with the second user:
				var convoExists = user1Convos?.Any(convo => convo?.Users?.Any(user => user.Id.Equals(users[1].Id)) == true);
				// If conversations doesn't already exist, make it:
				if (convoExists.GetValueOrDefault(false) == false)
				{
					// Instantiate new Conversation:
					var conversation = new Conversation()
					{
						DatePostedUTC = DateTime.UtcNow,
						Users = users,
						Messages = new List<Message>()
					};
					// Add it to the database:
					var result = await _conversationDAO.Add(conversation);
				}
				// Return the result:
				return new DTO<Conversation>()
				{
					Success = true
				};
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Log the exception:
				LoggerHelper.Log(e);
				// Throw it up:
				throw e;
			}
		}
		/// <summary>
		/// Method for creating a new message.
		/// </summary>
		/// <param name="request">HttpRequest object.</param>
		/// <param name="message">Message object.</param>
		/// <param name="user">User object.</param>
		/// <returns>Returns the instantiated Message with all it's data ready to go.</returns>
		public Message CreateMessage(HttpRequest request, Message message, User user)
		{
			// If the form has any elements:
			if (request.Form.Any())
			{
				// If the form has the messageBody key, set the message body:
				if (request.Form.Keys.Contains("messageBody"))
				{
					message.MessageBody = request.Form["messageBody"];
				}
				// Set the rest of the properties for the Message:
				message.Id = string.Format("{0:10}{1}", DateTime.Now.Ticks, Guid.NewGuid());
				message.Username = user.Username;
				message.ProfilePicUri = user.ProfilePicUri;
				message.UserId = user.Id;
				message.DatePostedUTC = DateTime.UtcNow;
			}
			// Return the message:
			return message;
		}
		/// <summary>
		/// Method for leaving a Conversation.
		/// </summary>
		/// <param name="conversation">Conversation object.</param>
		/// <param name="user">User who is leaving.</param>
		/// <returns>DTO containing the updated Conversation.</returns>
		public async Task<DTO<Conversation>> LeaveConversation(Conversation conversation, User user)
		{
			// Surround with try/catch:
			try
			{
				// Remove the user from the conversation based off its Id (users messages with remain in the conversation, but the conversation won't appear in their chats anymore):
				conversation.Users.RemoveAll(x => x.Id.Equals(user.Id));
				// Update the conversation:
				var result = await _conversationDAO.Update(conversation.Id, conversation);
				// Return the result:
				return new DTO<Conversation>()
				{
					Data = result,
					Success = true
				};
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Log the exception:
				LoggerHelper.Log(e);
				// Throw it up:
				throw e;
			}
		}
		/// <summary>
		/// Method for deleting a message.
		/// </summary>
		/// <param name="conversation">Conversation object.</param>
		/// <param name="messageId">String message id.</param>
		/// <returns>DTO containing the updated Conversation.</returns>
		public async Task<DTO<Conversation>> DeleteMessage(Conversation conversation, string messageId)
		{
			// Surround with try/catch:
			try
			{
				// Remove message from messages based off id:
				conversation.Messages.RemoveAll(x => x.Id.Equals(messageId));
				// Update the conversation:
				var result = await _conversationDAO.Update(conversation.Id, conversation);
				// Return the result:
				return new DTO<Conversation>()
				{
					Data = result,
					Success = true
				};
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Log the exception:
				LoggerHelper.Log(e);
				// Throw it up:
				throw e;
			}
		}
		/// <summary>
		/// Method for getting all conversations for a user.
		/// </summary>
		/// <param name="userId">String of user id.</param>
		/// <returns>DTO containing list of Conversations.</returns>
		public async Task<DTO<List<Conversation>>> GetAllConversations(string userId)
		{
			// Surround with try/catch:
			try
			{
				// Get all the conversations:
				var conversations = await _conversationDAO.GetAll();
				// Grab all conversations that a user is connected to:
				var result = conversations?.Where(convo => convo?.Users?.Any(user => user.Id.Equals(userId)) == true)?.ToList() ?? new List<Conversation>();
				// Order the conversations by the most recent:
				var orderedList = result?.OrderByDescending(x => x?.Messages?.LastOrDefault()?.DatePostedUTC)?.ToList() ?? new List<Conversation>();
				// Return the result:
				return new DTO<List<Conversation>>()
				{
					Data = orderedList,
					Success = true
				};
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Log the exception:
				LoggerHelper.Log(e);
				// Throw it up:
				throw e;
			}
		}
		/// <summary>
		/// Method for getting a conversation.
		/// </summary>
		/// <param name="conversationId">String conversation id.</param>
		/// <returns>DTO containing the Conversation.</returns>
		public async Task<DTO<Conversation>> GetConversation(string conversationId)
		{
			// Surround with try/catch:
			try
			{
				// Get the conversation:
				var conversation = await _conversationDAO.Get(conversationId);
				// Return the result:
				return new DTO<Conversation>()
				{
					Data = conversation,
					Success = true
				};
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Log the exception:
				LoggerHelper.Log(e);
				// Throw it up:
				throw e;
			}
		}
		/// <summary>
		/// Method for sending a Message.
		/// </summary>
		/// <param name="conversation">Conversation object.</param>
		/// <param name="message">Message object.</param>
		/// <returns>DTO containing the updated Conversation.</returns>
		public async Task<DTO<Conversation>> SendMessage(Conversation conversation, Message message)
		{
			// Surround with try/catch:
			try
			{
				// Add the message to the conversation:
				conversation.Messages.Add(message);
				// Update the conversation:
				var result = await _conversationDAO.Update(conversation.Id, conversation);
				// Return the result:
				return new DTO<Conversation>()
				{
					Data = result,
					Success = true
				};
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Log the exception:
				LoggerHelper.Log(e);
				// Throw it up:
				throw e;
			}
		}
		/// <summary>
		/// Method for deleting old profile pic of User and uploading a new one for their profile pic.
		/// </summary>
		/// <param name="user">User of the current user.</param>
		/// <returns>bool value.</returns>
		public async Task<DTO<bool>> UpdateUserProfilePic(User user)
		{
			// Surround with try/catch:
			try
			{
				// Get the Conversations of the user:
				var result = await GetAllConversations(user.Id);
				var conversationList = result.Data;
				// Loop through it and update the profile pic for each conversation:
				foreach (var convo in conversationList)
				{
					// Grab the user in the convo:
					var convoUser = convo.Users?.Where(x => x.Id.Equals(user.Id));
					// If it has the user:
					if (convoUser?.Any() == true)
					{
						// Loop through the users and update the pics (should only ever be one really):
						foreach (var guy in convoUser)
						{
							guy.ProfilePicUri = user.ProfilePicUri;
							await _conversationDAO.Update(convo.Id, convo);
						}
					}
					// Grab the messages in the convo:
					var convoMessages = convo.Messages?.Where(x => x.UserId.Equals(user.Id));
					// If it has the user:
					if (convoMessages?.Any() == true)
					{
						// Loop through the messages and update the pics:
						foreach (var message in convoMessages)
						{
							message.ProfilePicUri = user.ProfilePicUri;
							await _conversationDAO.Update(convo.Id, convo);
						}
					}
				}
				// Return successful DAO:
				return new DTO<bool>()
				{
					Success = true
				};
			}
			// Catch any exceptions:
			catch (Exception e)
			{
				// Log the exception:
				LoggerHelper.Log(e);
				// Throw the exception:
				throw e;
			}
		}
	}
}
