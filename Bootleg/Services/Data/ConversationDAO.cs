using Bootleg.Helpers;
using Bootleg.Models.Documents;
using Bootleg.Services.Data.Interfaces;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bootleg.Services.Data
{
	/// <summary>
	/// User DAO for handling all data access concerning the User documents in the database. Implements the IDAO interface.
	/// </summary>
	public class ConversationDAO : IDAO<Conversation>
	{
		// Private readonly MongoCollection of users:
		private readonly IMongoCollection<Conversation> _conversation;
		/// <summary>
		/// Constructor that sets the MongoClient, Database, and Collection.
		/// </summary>
		/// <param name="connectionString">Connection as type string.</param>
		/// <param name="databaseName">Database name as type string.</param>
		/// <param name="contentCollection">Collection name as type string.</param>
		public ConversationDAO(string connectionString, string databaseName, string contentCollection)
		{
			// Surround with try/catch:
			try
			{
				// Create MongoClient using connection string:
				var client = new MongoClient(connectionString);
				// Get the database using the database name:
				var database = client.GetDatabase(databaseName);
				// Instantiate our collection of users:
				_conversation = database.GetCollection<Conversation>(contentCollection);
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
		public async Task<List<Conversation>> GetAll()
		{
			// Surround with try/catch:
			try
			{
				// Get all users:
				var content = await _conversation.FindAsync(x => true);
				// Convert to list:
				var contentList = await content.ToListAsync();
				// Return DTO with encapsulated data:
				return contentList;
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
		public async Task<List<Conversation>> GetAllFromIndexes(List<string> indexes)
		{
			// Surround with try/catch:
			try
			{
				var filterDefinition = new FilterDefinitionBuilder<Conversation>();
				var filter = filterDefinition.In(x => x.Id, indexes);
				var content = await _conversation.FindAsync(filter);
				// Convert to list:
				var contentList = await content.ToListAsync();
				// Return DTO with encapsulated data:
				return contentList;
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
		/// <param name="index">Index of object of type string.</param>
		/// <returns>DTO encapsulating a List of type User.</returns>
		public async Task<Conversation> Get(string index)
		{
			// Surround with try/catch:
			try
			{
				// Get first user with the specified id:
				var content = await _conversation.FindAsync(x => x.Id.Equals(index));
				// Grab the first or default of the result:
				var foundContent = await content.FirstOrDefaultAsync();
				// Return DTO with encapsulated data:
				return foundContent;
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
		/// <param name="newContent">Object to be added of type generic.</param>
		/// <returns>DTO encapsulating a List of type User.</returns>
		public async Task<Conversation> Add(Conversation newContent)
		{
			// Surround with try/catch:
			try
			{
				// Insert User into the collection:
				await _conversation.InsertOneAsync(newContent);
				// Return DTO with encapsulated data:
				return newContent;
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
		/// <param name="index">Index of object of type string.</param>
		/// <param name="updatedContent">Object to be updated of type generic.</param>
		/// <returns>DTO encapsulating a List of type User.</returns>
		public async Task<Conversation> Update(string index, Conversation updatedContent)
		{
			// Surround with try/catch:
			try
			{
				// Replace the user in the collection that matches the id passed in with the specified updated user:
				await _conversation.FindOneAndReplaceAsync(x => x.Id.Equals(index), updatedContent);
				// Return DTO with encapsulated data:
				return updatedContent;
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
		/// <param name="index">Index of object of type string.</param>
		/// <returns>DTO encapsulating a List of type User.</returns>
		public async Task Delete(string index)
		{
			// Surround with try/catch:
			try
			{
				// Delete the user in the collection that matches the id:
				await _conversation.FindOneAndDeleteAsync(x => x.Id.Equals(index));
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
