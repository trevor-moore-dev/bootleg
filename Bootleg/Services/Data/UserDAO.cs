using MongoDB.Driver;
using Bootleg.Helpers;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bootleg.Services.Data
{
	public class UserDAO : IDAO<User, DTO<List<User>>>
	{
		private readonly IMongoCollection<User> _users;

		public UserDAO(string connectionString, string databaseName, string userCollection)
		{
			try
			{
				var client = new MongoClient(connectionString);
				var database = client.GetDatabase(databaseName);
				_users = database.GetCollection<User>(userCollection);
			}
			catch (Exception e)
			{
				LoggerHelper.Log(e);
				throw e;
			}
		}

		public async Task<DTO<List<User>>> GetAll()
		{
			try
			{ 
				var users = await _users.FindAsync(x => true);
				var usersList = await users.ToListAsync();
				return new DTO<List<User>>()
				{
					Data = usersList,
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DTO<List<User>>> Get(string index)
		{
			try
			{
				var users = await _users.FindAsync(x => x.Id.Equals(index));
				var foundUser = await users.FirstOrDefaultAsync();
				return new DTO<List<User>>()
				{
					Data = new List<User>() { foundUser },
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DTO<List<User>>> Add(User newUser)
		{
			try
			{ 
				await _users.InsertOneAsync(newUser);
				return new DTO<List<User>>()
				{
					Data = new List<User>() { newUser },
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DTO<List<User>>> Update(string index, User updatedUser)
		{
			try
			{
				await _users.ReplaceOneAsync(x => x.Id.Equals(index), updatedUser);
				return new DTO<List<User>>()
				{
					Data = new List<User>() { updatedUser },
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DTO<List<User>>> Delete(string index)
		{
			try
			{
				await _users.DeleteOneAsync(x => x.Id.Equals(index));
				return new DTO<List<User>>()
				{
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}
	}
}