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

namespace Bootleg.Services.Business
{
	public class ConversationService : IConversationService
	{
		// Private readonly data access object to be injected:
		private readonly IDAO<Conversation> _conversationDAO;
		/// <summary>
		/// Constructor that will instantiate our dependencies that get injected by the container.
		/// </summary>
		/// <param name="contentDAO">DAO to be injected.</param>
		public ConversationService(IDAO<Conversation> _conversationDAO)
		{
			// Set our dependencies:
			this._conversationDAO = _conversationDAO;
		}

		public async Task<DTO<Conversation>> CreateConversation(List<User> users)
		{
			try
			{
				var conversation = new Conversation()
				{
					Users = users,
					Messages = new List<Message>()
				};

				var result = await _conversationDAO.Add(conversation);

				return new DTO<Conversation>()
				{
					Data = result,
					Success = true
				};
			}
			catch(Exception e)
			{
				LoggerHelper.Log(e);
				throw e;
			}
		}

		public Message CreateMessage(HttpRequest request, Message message, User user)
		{
			if (request.Form.Any())
			{
				if (request.Form.Keys.Contains("messageBody"))
				{
					message.MessageBody = request.Form["messageBody"];
				}

				message.Username = user.Username;
				message.ProfilePicUri = user.ProfilePicUri;
				message.UserId = user.Id;
				message.DatePostedUTC = DateTime.UtcNow;
			}

			return message;
		}

		public async Task<DTO<Conversation>> LeaveConversation(Conversation conversation, User user)
		{
			try
			{
				conversation.Users.RemoveAll(x => x.Id.Equals(user.Id));
				var result = await _conversationDAO.Update(conversation.Id, conversation);

				return new DTO<Conversation>()
				{
					Data = result,
					Success = true
				};
			}
			catch(Exception e)
			{
				LoggerHelper.Log(e);
				throw e;
			}
		}

		public async Task<DTO<Conversation>> DeleteMessage(Conversation conversation, string messageId)
		{
			try
			{
				conversation.Messages.RemoveAll(x => x.Id.Equals(messageId));
				var result = await _conversationDAO.Update(conversation.Id, conversation);

				return new DTO<Conversation>()
				{
					Data = result,
					Success = true
				};
			}
			catch (Exception e)
			{
				LoggerHelper.Log(e);
				throw e;
			}
		}

		public async Task<DTO<List<Conversation>>> GetAllConversations(string userId)
		{
			try
			{
				var conversations = await _conversationDAO.GetAll();
				var result = conversations?.Where(convo => convo?.Users?.Any(user => user.Id.Equals(userId)) == true)?.ToList() ?? new List<Conversation>();

				return new DTO<List<Conversation>>()
				{
					Data = result,
					Success = true
				};
			}
			catch (Exception e)
			{
				LoggerHelper.Log(e);
				throw e;
			}
		}

		public async Task<DTO<Conversation>> GetConversation(string conversationId)
		{
			try
			{
				var conversation = await _conversationDAO.Get(conversationId);
				return new DTO<Conversation>()
				{
					Data = conversation,
					Success = true
				};
			}
			catch (Exception e)
			{
				LoggerHelper.Log(e);
				throw e;
			}
		}

		public async Task<DTO<Conversation>> SendMessage(Conversation conversation, Message message)
		{
			try
			{
				conversation.Messages.Add(message);
				var result = await _conversationDAO.Update(conversation.Id, conversation);

				return new DTO<Conversation>()
				{
					Data = result,
					Success = true
				};
			}
			catch (Exception e)
			{
				LoggerHelper.Log(e);
				throw e;
			}
		}
	}
}
