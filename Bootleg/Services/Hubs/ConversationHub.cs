using System;
using System.Threading.Tasks;
using Bootleg.Helpers;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Microsoft.AspNetCore.SignalR;

// Trevor Moore
// CST-451
// 2/7/2020
// This is my own work.

namespace SecretSanta2._0.Services.Hubs
{
    /// <summary>
    /// SignalR Hub for real-time delivery of messages in conversations between users.
    /// </summary>
    public class ConversationHub : Hub
    {
        // Private readonly conversation service dependency:
        //private readonly IConversationService _conversationService;
        /// <summary>
        /// Constructor for initializing our dependencies.
        /// </summary>
        /// <param name="_conversationService">Conversation service.</param>
        //public ConversationHub(IConversationService _conversationService)
        //{
        // Set our dependencies:
        //this._conversationService = _conversationService;
        //}
        /// <summary>
        /// Method for joining a connection from the SignalR group for conversations.
        /// </summary>
        /// <param name="conversationId">String of conversation id.</param>
        /// <returns>Task.</returns>
        public async Task JoinConversation(string conversationId)
        {
            // Surround with try/catch:
            try
            {
                // Add the connection to the specified SignalR group, based off the conversation id:
                await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception and return nothing in this instance, since this is a websocket connection:
                LoggerHelper.Log(ex);
            }
        }
        /// <summary>
        /// Method for delivering real-time data to those in a conversation (they join a SignalR group for content delivery).
        /// </summary>
        /// <param name="message">DTO containing new Message.</param>
        /// <returns>Task of DTO populated with a Conversation object.</returns>
        public async Task SendMessage(DTO<Message> message)
        {
            // Surround with try/catch:
            try
            {
                // Send the conversation to all connections in the group in real-time:
                await Clients.Group(message.Id).SendAsync("SendMessage", message.Data);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception and return nothing in this instance, since this is a websocket connection:
                LoggerHelper.Log(ex);
            }
        }
        /// <summary>
        /// Method for removing a connection from the SignalR group for conversations.
        /// </summary>
        /// <param name="conversationId">String of conversation id.</param>
        /// <returns>Task.</returns>
        public async Task LeaveConversation(string conversationId)
        {
            // Surround with try/catch:
            try
            {
                // Remove the connection from the specified SignalR group, based off the conversation id:
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId);
            }
            // Catch any exceptions:
            catch (Exception ex)
            {
                // Log the exception and return nothing in this instance, since this is a websocket connection:
                LoggerHelper.Log(ex);
            }
        }
    }
}