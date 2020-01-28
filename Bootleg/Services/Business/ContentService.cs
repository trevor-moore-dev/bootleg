using Bootleg.Helpers;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Bootleg.Services.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bootleg.Services.Business
{
	public class ContentService : IContentService
	{
		// Private readonly data access object to be injected:
		private readonly IDAO<Content> _contentDAO;
		private readonly IDAO<User> _userDAO;
		/// <summary>
		/// Constructor that will instantiate our dependencies that get injected by the container.
		/// </summary>
		/// <param name="contentDAO">DAO to be injected.</param>
		public ContentService(IDAO<Content> contentDAO, IDAO<User> userDAO)
		{
			// Set our dependencies:
			_contentDAO = contentDAO;
			_userDAO = userDAO;
		}
		/// <summary>
		/// Method for adding content to the db.
		/// </summary>
		/// <param name="content">content as type of Content.</param>
		/// <returns>DTO encapsulating a list of strings of validated token.</returns>
		public async Task<DTO<Tuple<Content, User>>> AddContentForUser(Content content, User user)
		{
			// Surround with try/catch:
			try
			{
				content.UserId = user?.Id;
				content.UserName = user?.Username;
				content.UserProfilePicUri = user?.ProfilePicUri ?? string.Empty;
				content.DatePostedUTC = DateTime.UtcNow;
				// Add User to the database:
				await _contentDAO.Add(content);

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
		/// Method for adding content to the db.
		/// </summary>
		/// <param name="user">content as type of Content.</param>
		/// <returns>DTO encapsulating a list of strings of validated token.</returns>
		public async Task<DTO<List<Content>>> GetAllContent(User user)
		{
			// Surround with try/catch:
			try
			{
				var contentIds = new List<string>();

				var followingUsers = await _userDAO.GetAllFromIndexes(user?.FollowingIds ?? new List<string>());

				foreach (var followingUser in followingUsers)
				{
					// Add content ids of the people current user is following:
					contentIds.AddRange(followingUser.PostedContentIds ?? new List<string>());
				}
				// Add the content ids of the current user's post so they can see what they posted in their feed:
				contentIds.AddRange(user?.PostedContentIds ?? new List<string>());

				var contentList = await _contentDAO.GetAllFromIndexes(contentIds);
				var orderedList = contentList?.OrderByDescending(x => x?.DatePostedUTC)?.Take(100)?.ToList();

				// Return successful with the JWT:
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
		/// Method for adding content to the db.
		/// </summary>
		/// <param name="user">content as type of Content.</param>
		/// <returns>DTO encapsulating a list of strings of validated token.</returns>
		public async Task<DTO<Tuple<User, List<Content>>>> GetUserContent(User user)
		{
			// Surround with try/catch:
			try
			{
				var contentList = await _contentDAO.GetAllFromIndexes(user?.PostedContentIds ?? new List<string>());
				var orderedList = contentList?.OrderByDescending(x => x?.DatePostedUTC)?.ToList();

				// Return successful with the JWT:
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
	}
}
