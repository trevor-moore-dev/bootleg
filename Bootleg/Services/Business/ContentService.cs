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
		private readonly IDAO<Content, DTO<List<Content>>> _contentDAO;
		/// <summary>
		/// Constructor that will instantiate our dependencies that get injected by the container.
		/// </summary>
		/// <param name="contentDAO">DAO to be injected.</param>
		public ContentService(IDAO<Content, DTO<List<Content>>> contentDAO)
		{
			// Set our dependency:
			this._contentDAO = contentDAO;
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
				content.UserId = user.Id;
				content.UserName = user.Username;
				content.UserProfilePicUri = user.ProfilePicUri ?? string.Empty;
				content.DatePostedUTC = DateTime.UtcNow.ToString();
				// Add User to the database:
				await _contentDAO.Add(content);

				if (user.PostedContentIds == null)
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
		/// <param name="content">content as type of Content.</param>
		/// <returns>DTO encapsulating a list of strings of validated token.</returns>
		public async Task<DTO<List<Content>>> GetAllContent(string userId)
		{
			// Surround with try/catch:
			try
			{
				var asdf = await _contentDAO.GetAll();

				var result = asdf.Data.Where(x => x.UserId.Equals(userId)).ToList();

				// Return successful with the JWT:
				return new DTO<List<Content>>()
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
				// Throw the exception:
				throw e;
			}
		}
	}
}
