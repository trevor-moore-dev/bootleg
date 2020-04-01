using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

// Trevor Moore
// CST-451
// 2/8/2020
// This is my own work.

namespace Bootleg.Services.Business.Interfaces
{
	/// <summary>
	/// Interface for defining contract for user service.
	/// </summary>
	public interface IUserService
	{
		/// <summary>
		/// Method for searching all Users based off username.
		/// </summary>
		/// <param name="username">string of username (can be a partial username).</param>
		/// <returns>DTO containing list of Users.</returns>
		Task<DTO<List<User>>> SearchAllUsers(string username);
		/// <summary>
		/// Method for getting a specific User.
		/// </summary>
		/// <param name="userId">User id to get.</param>
		/// <returns>DTO containing User.</returns>
		Task<DTO<User>> GetUser(string userId);
		/// <summary>
		/// Method for getting a list of User data based off of the ids passesd in.
		/// </summary>
		/// <param name="userIds">List of string user ids.</param>
		/// <returns>DTO containing list of Users.</returns>
		Task<DTO<List<User>>> GetUsers(List<string> userIds);
		/// <summary>
		/// Method for following a User.
		/// </summary>
		/// <param name="user">User object.</param>
		/// <param name="userId">String user id.</param>
		/// <returns>DTO containing the User.</returns>
		Task<DTO<User>> FollowUser(User user, string userId);
		/// <summary>
		/// Method for unfollowing a User.
		/// </summary>
		/// <param name="user">User object.</param>
		/// <param name="userId">String user id.</param>
		/// <returns>DTO containing the User.</returns>
		Task<DTO<User>> UnfollowUser(User user, string userId);
		/// <summary>
		/// Method for updating a User.
		/// </summary>
		/// <param name="currentUser">User to update.</param>
		/// <returns>DTO containing the updated User.</returns>
		Task<DTO<User>> UpdateUser(User currentUser);
		/// <summary>
		/// Method for updating a User's profile.
		/// </summary>
		/// <param name="currentUser">User to update.</param>
		/// <param name="request">HttpRequest object.</param>
		/// <param name="httpContext">HttpContext object.</param>
		/// <returns>DTO containing User.</returns>
		Task<DTO<User>> UpdateUserProfile(User currentUser, HttpRequest request, HttpContext httpContext);
		/// <summary>
		/// Method for deleting a User.
		/// </summary>
		/// <param name="userID">String user id.</param>
		/// <returns>DTO containing User.</returns>
		Task<DTO<User>> DeleteUser(string userID);
		/// <summary>
		/// Method for adding a like for a user.
		/// </summary>
		/// <param name="userID">String user id.</param>
		/// <param name="contentID">String content id.</param>
		/// <returns>DTO containing bool.</returns>
		Task<DTO<bool>> AddUserLike(string userID, string contentID);
		/// <summary>
		/// Method for adding a dislike for a user.
		/// </summary>
		/// <param name="userID">String user id.</param>
		/// <param name="contentID">String content id.</param>
		/// <returns>DTO containing bool.</returns>
		Task<DTO<bool>> AddUserDislike(string userID, string contentID);
	}
}