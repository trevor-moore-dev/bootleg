using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// Trevor Moore
// CST-451
// 2/7/2020
// This is my own work.

namespace Bootleg.Services.Business.Interfaces
{
	/// <summary>
	/// Interface for the contract of the Content service.
	/// </summary>
	public interface IContentService
	{
		/// <summary>
		/// Method for adding Content for a User.
		/// </summary>
		/// <param name="content">Content to be uploaded.</param>
		/// <param name="user">User who is doing the upload.</param>
		/// <returns>DTO containing Tuple of the Content and User.</returns>
		Task<DTO<Tuple<Content, User>>> AddContentForUser(Content content, User user);
		/// <summary>
		/// Method for getting all the Content for a User's Feed (including content from Users they follow).
		/// </summary>
		/// <param name="user">User to get the Content for.</param>
		/// <returns>DTO containing a list of the User's Content.</returns>
		Task<DTO<List<Content>>> GetAllContent(User user);
		/// <summary>
		/// Method for getting a User's "profile" data: their User data and their Content data.
		/// </summary>
		/// <param name="user">User object to get data for.</param>
		/// <returns>DTO containing Tuple of the User and list of their Content.</returns>
		Task<DTO<Tuple<User, List<Content>>>> GetUserContent(User user);
	}
}