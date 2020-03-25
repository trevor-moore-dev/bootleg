using Bootleg.Helpers;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Bootleg.Services.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Trevor Moore
// CST-451
// 2/7/2020
// This is my own work.

namespace Bootleg.Services.Business
{
	/// <summary>
	/// Class for handling tasks related to all Content data persistence. Implements IContentService.
	/// </summary>
	public class ContentService : IContentService
	{
		// Private readonly IDAO dependencies for content and users:
		private readonly IDAO<Content> _contentDAO;
		private readonly IDAO<User> _userDAO;
		/// <summary>
		/// Constructor for injecting our dependencies.
		/// </summary>
		/// <param name="contentDAO">Content IDAO.</param>
		/// <param name="userDAO">User IDAO.</param>
		public ContentService(IDAO<Content> contentDAO, IDAO<User> userDAO)
		{
			// Set our dependencies:
			_contentDAO = contentDAO;
			_userDAO = userDAO;
		}
		/// <summary>
		/// Method for adding Content for a User.
		/// </summary>
		/// <param name="content">Content to be uploaded.</param>
		/// <param name="user">User who is doing the upload.</param>
		/// <returns>DTO containing Tuple of the Content and User.</returns>
		public async Task<DTO<Tuple<Content, User>>> AddContentForUser(Content content, User user)
		{
			// Surround with try/catch:
			try
			{
				// Set content properties:
				content.UserId = user?.Id;
				content.UserName = user?.Username;
				content.UserProfilePicUri = user?.ProfilePicUri ?? string.Empty;
				content.DatePostedUTC = DateTime.UtcNow;
				// Add User to the database:
				await _contentDAO.Add(content);
				// Set their posted content Ids:
				if (user?.PostedContentIds == null)
				{
					user.PostedContentIds = new List<string>() { content.Id };
				}
				else
				{
					user.PostedContentIds.Add(content.Id);
				}
				// Return successful with the JWT:
				return new DTO<Tuple<Content, User>>()
				{
					Data = new Tuple<Content, User>(content, user),
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
		/// <summary>
		/// Method for getting all the Content for a User's Feed (including content from Users they follow).
		/// </summary>
		/// <param name="user">User to get the Content for.</param>
		/// <returns>DTO containing a list of the User's Content.</returns>
		public async Task<DTO<List<Content>>> GetAllContent(User user)
		{
			// Surround with try/catch:
			try
			{
				// New list of strings for sotring content Ids:
				var contentIds = new List<string>();
				// Get all the users that the current user is following:
				var followingUsers = await _userDAO.GetAllFromIndexes(user?.FollowingIds ?? new List<string>());
				// Loop through each user they are following:
				foreach (var followingUser in followingUsers)
				{
					// Add content ids of the people current user is following:
					contentIds.AddRange(followingUser.PostedContentIds ?? new List<string>());
				}
				// Add the content ids of the current user's post so they can see what they posted in their feed:
				contentIds.AddRange(user?.PostedContentIds ?? new List<string>());
				// Get all of the content for the current user's feed using all of the ids we grabbed:
				var contentList = await _contentDAO.GetAllFromIndexes(contentIds);
				// Order the content by date latest posted:
				var orderedList = contentList?.OrderByDescending(x => x?.DatePostedUTC)?.Take(100)?.ToList();
				// Return list of Content inside DTO:
				return new DTO<List<Content>>()
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
				// Throw the exception:
				throw e;
			}
		}
		/// <summary>
		/// Method for getting a User's "profile" data: their User data and their Content data.
		/// </summary>
		/// <param name="user">User object to get data for.</param>
		/// <returns>DTO containing Tuple of the User and list of their Content.</returns>
		public async Task<DTO<Tuple<User, List<Content>>>> GetUserContent(User user)
		{
			// Surround with try/catch:
			try
			{
				// Get all of the current User's content:
				var contentList = await _contentDAO.GetAllFromIndexes(user?.PostedContentIds ?? new List<string>());
				// Order by date latest posted:
				var orderedList = contentList?.OrderByDescending(x => x?.DatePostedUTC)?.ToList();
				// Return the list of Content data in Tuple along with the User data:
				return new DTO<Tuple<User, List<Content>>>()
				{
					Data = new Tuple<User, List<Content>>(user, orderedList ?? new List<Content>()),
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
		/// <summary>
		/// Method for getting the Content of the id passed in.
		/// </summary>
		/// <param name="contentId">The id of the Content to get.</param>
		/// <returns>DTO containing the Content.</returns>
		public async Task<DTO<Content>> GetContent(string contentId)
		{
			// Surround with try/catch:
			try
			{
				// Get the content of the id:
				var content = await _contentDAO.Get(contentId);
				// Return list of Content inside DTO:
				return new DTO<Content>()
				{
					Data = content,
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