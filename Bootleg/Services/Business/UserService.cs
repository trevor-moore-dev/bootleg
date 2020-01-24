using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Business.Interfaces;
using Bootleg.Services.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bootleg.Services.Business
{
	public class UserService :IUserService
	{
		// Private readonly data access object to be injected:
		private readonly IDAO<User, DTO<List<User>>> _userDAO;
		/// <summary>
		/// Constructor that will instantiate our dependencies that get injected by the container.
		/// </summary>
		/// <param name="userDAO">DAO to be injected.</param>
		public UserService(IDAO<User, DTO<List<User>>> userDAO)
		{
			// Set our dependency:
			this._userDAO = userDAO;
		}
		public async Task<DTO<List<User>>> GetAllUsers()
		{
			try
			{
				var result = await _userDAO.GetAll();
				return result;
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DTO<List<User>>> GetUser(string userID)
		{
			try
			{
				var result = await _userDAO.Get(userID);
				return result;
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DTO<List<User>>> UpdateUser(User currentUser)
		{
			try
			{
				var result = await _userDAO.Update(currentUser.Id, currentUser);
				return result;
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DTO<List<User>>> DeleteEvent(string userID)
		{
			try
			{
				var result = await _userDAO.Delete(userID);
				return result;
			}
			catch (Exception e)
			{
				throw e;
			}
		}
	}
}