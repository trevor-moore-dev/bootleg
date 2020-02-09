using MongoDB.Driver;
using Bootleg.Helpers;
using Bootleg.Models.Documents;
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
	public class UserDAO : IDAO<User>
	{
		// Private readonly MongoCollection of User:
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
		/// <returns>List of type User.</returns>
		public async Task<List<User>> GetAll()
		{
			// Surround with try/catch:
			try
			{ 
				// Get all users:
				var users = await _users.FindAsync(x => true);
				// Convert to list:
				var usersList = await users.ToListAsync();
				// Return data:
				return usersList;
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
		/// Method for getting all User data for a list of ids.
		/// </summary>
		/// <param name="indexes">List of string of ids to get.</param>
		/// <returns>List of User objects.</returns>
		public async Task<List<User>> GetAllFromIndexes(List<string> indexes)
		{
			// Surround with try/catch:
			try
			{
				// Create filter definition:
				var filterDefinition = new FilterDefinitionBuilder<User>();
				// Add in ids for filtering:
				var filter = filterDefinition.In(x => x.Id, indexes);
				// Find data for id filter:
				var users = await _users.FindAsync(filter);
				// Convert to list:
				var usersList = await users.ToListAsync();
				// Return data:
				return usersList;
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
		/// Method that will get a User document from the database.
		/// </summary>
		/// <param name="index">Index of object of type string.</param>
		/// <returns>User object.</returns>
		public async Task<User> Get(string index)
		{
			// Surround with try/catch:
			try
			{
				// Get first user with the specified id:
				var users = await _users.FindAsync(x => x.Id.Equals(index));
				// Grab the first or default of the result:
				var foundUser = await users.FirstOrDefaultAsync();
				// Return data:
				return foundUser;
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
		/// Method that will add the User document to the database.
		/// </summary>
		/// <param name="newUser">Object to be added of type generic.</param>
		/// <returns>User object.</returns>
		public async Task<User> Add(User newUser)
		{
			// Surround with try/catch:
			try
			{
				// Insert User into the collection:
				await _users.InsertOneAsync(newUser);
				// Return data:
				return newUser;
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
		/// Method that will update the User document in the database.
		/// </summary>
		/// <param name="index">Index of object of type string.</param>
		/// <param name="updatedUser">Object to be updated of type generic.</param>
		/// <returns>User object.</returns>
		public async Task<User> Update(string index, User updatedUser)
		{
			// Surround with try/catch:
			try
			{
				// Replace the user in the collection that matches the id passed in with the specified updated user:
				await _users.FindOneAndReplaceAsync(x => x.Id.Equals(index), updatedUser);
				// Return data:
				return updatedUser;
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
		/// Method that will delete a User document from the database.
		/// </summary>
		/// <param name="index">Index of object of type string.</param>
		/// <returns>Task.</returns>
		public async Task Delete(string index)
		{
			// Surround with try/catch:
			try
			{
				// Delete the user in the collection that matches the id:
				await _users.FindOneAndDeleteAsync(x => x.Id.Equals(index));
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