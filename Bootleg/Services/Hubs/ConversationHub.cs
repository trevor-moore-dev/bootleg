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

        public async Task GetConversations()
        {
            try
            {
                //var participants = await _conversationService.GetConversations();
                //await Clients.All.SendAsync("GetConversations", participants);
            }
            catch (Exception ex)
            {
                LoggerHelper.Log(ex);
            }
        }

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("Send", $"{Context.ConnectionId} has joined the group {groupName}.");
        }

        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("Send", $"{Context.ConnectionId} has left the group {groupName}.");
        }
    }
}