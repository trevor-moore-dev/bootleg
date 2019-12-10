using MongoDB.Driver;
using Bootleg.Helpers;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using Bootleg.Services.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

namespace Bootleg.Services.Data
{
	/// <summary>
	/// User DAO for handling all data access concerning the User documents in the database. Implements the IDAO interface.
	/// </summary>
	public class UserDAO : IDAO<User, DTO<List<User>>>
	{
		// Private readonly MongoCollection of users:
		private readonly IMongoCollection<User> _users;
		/// <summary>
		/// Constructor that sets the MongoClient, Database, and Collection.
		/// </summary>
		/// <param name="connectionString">Connection as type string.</param>
		/// <param name="databaseName">Database name as type string.</param>
		/// <param name="userCollection">Collection name as type string.</param>
		public UserDAO(string connectionString, string databaseName, string userCollection)
		{
			// Surround with try/catch:
			try
			{
				// Create MongoClient using connection string:
				var client = new MongoClient(connectionString);
				// Get the database using the database name:
				var database = client.GetDatabase(databaseName);
				// Instantiate our collection of users:
				_users = database.GetCollection<User>(userCollection);
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
		/// Method for getting all data.
		/// </summary>
		/// <returns>DTO encapsulating a List of type User.</returns>
		public async Task<DTO<List<User>>> GetAll()
		{
			// Surround with try/catch:
			try
			{ 
				// Get all users:
				var users = await _users.FindAsync(x => true);
				// Convert to list:
				var usersList = await users.ToListAsync();
				// Return DTO with encapsulated data:
				return new DTO<List<User>>()
				{
					Data = usersList,
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
		/// Method that will get a document from the database.
		/// </summary>
		/// <param name="idx">Index of object of type string.</param>
		/// <returns>DTO encapsulating a List of type User.</returns>
		public async Task<DTO<List<User>>> Get(string index)
		{
			// Surround with try/catch:
			try
			{
				// Get first user with the specified id:
				var users = await _users.FindAsync(x => x.Id.Equals(index));
				// Grab the first or default of the result:
				var foundUser = await users.FirstOrDefaultAsync();
				// Return DTO with encapsulated data:
				return new DTO<List<User>>()
				{
					Data = new List<User>() { foundUser },
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
		/// Method that will add the document to the database.
		/// </summary>
		/// <param name="obj">Object to be added of type generic.</param>
		/// <returns>DTO encapsulating a List of type User.</returns>
		public async Task<DTO<List<User>>> Add(User newUser)
		{
			// Surround with try/catch:
			try
			{
				// Insert User into the collection:
				await _users.InsertOneAsync(newUser);
				// Return DTO with encapsulated data:
				return new DTO<List<User>>()
				{
					Data = new List<User>() { newUser },
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
		/// Method that will update the document in the database.
		/// </summary>
		/// <param name="idx">Index of object of type string.</param>
		/// <param name="obj">Object to be updated of type generic.</param>
		/// <returns>DTO encapsulating a List of type User.</returns>
		public async Task<DTO<List<User>>> Update(string index, User updatedUser)
		{
			// Surround with try/catch:
			try
			{
				// Replace the user in the collection that matches the id passed in with the specified updated user:
				await _users.ReplaceOneAsync(x => x.Id.Equals(index), updatedUser);
				// Return DTO with encapsulated data:
				return new DTO<List<User>>()
				{
					Data = new List<User>() { updatedUser },
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
		/// Method that will delete the document from the database.
		/// </summary>
		/// <param name="idx">Index of object of type string.</param>
		/// <returns>DTO encapsulating a List of type User.</returns>
		public async Task<DTO<List<User>>> Delete(string index)
		{
			// Surround with try/catch:
			try
			{
				// Delete the user in the collection that matches the id:
				await _users.DeleteOneAsync(x => x.Id.Equals(index));
				// Return DTO with encapsulated data:
				return new DTO<List<User>>()
				{
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