using Bootleg.Helpers;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Bootleg.Services.Data.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
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
		public ConversationService(IDAO<Conversation> contentDAO)
		{
			// Set our dependencies:
			_conversationDAO = contentDAO;
		}
		public async Task<DTO<Conversation>> CreateConversation(List<User> users)
		{
			throw new System.NotImplementedException();
		}

		public async Task<Message> CreateMessage(HttpRequest request)
		{
			throw new System.NotImplementedException();
		}

		public async Task<DTO<Conversation>> DeleteConversation(string conversationId)
		{
			throw new System.NotImplementedException();
		}

		public async Task<DTO<Conversation>> DeleteMessage(string conversationId, string messageId)
		{
			throw new System.NotImplementedException();
		}

		public async Task<DTO<List<Conversation>>> GetAllConversations(string userID)
		{
			throw new System.NotImplementedException();
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

		public async Task<DTO<Conversation>> SendMessage(Message message)
		{
			throw new System.NotImplementedException();
		}
	}
}
