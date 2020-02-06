using System;
using System.Threading.Tasks;
using Bootleg.Helpers;
using Bootleg.Services.Business.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace SecretSanta2._0.Services.Hubs
{
    public class ConversationHub : Hub
    {
        private readonly IConversationService _conversationService;

        public ConversationHub(IConversationService _conversationService)
        {
            this._conversationService = _conversationService;
        }

        public async Task GetConversation(string conversationId)
        {
            try
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
                var conversation = await _conversationService.GetConversation(conversationId);
                await Clients.Group(conversationId).SendAsync("GetChat", conversation);
            }
            catch (Exception ex)
            {
                LoggerHelper.Log(ex);
            }
        }

        public async Task LeaveConversation(string conversationId)
        {
            try
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId);
            }
            catch (Exception ex)
            {
                LoggerHelper.Log(ex);
            }
        }
    }
}