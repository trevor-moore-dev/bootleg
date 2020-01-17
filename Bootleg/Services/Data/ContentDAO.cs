using Bootleg.Helpers;
using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
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
	public class ContentDAO : IDAO<Content, DTO<List<Content>>>
	{
		// Private readonly MongoCollection of users:
		private readonly IMongoCollection<Content> _content;
		/// <summary>
		/// Constructor that sets the MongoClient, Database, and Collection.
		/// </summary>
		/// <param name="connectionString">Connection as type string.</param>
		/// <param name="databaseName">Database name as type string.</param>
		/// <param name="contentCollection">Collection name as type string.</param>
		public ContentDAO(string connectionString, string databaseName, string contentCollection)
		{
			// Surround with try/catch:
			try
			{
				// Create MongoClient using connection string:
				var client = new MongoClient(connectionString);
				// Get the database using the database name:
				var database = client.GetDatabase(databaseName);
				// Instantiate our collection of users:
				_content = database.GetCollection<Content>(contentCollection);
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
		public async Task<DTO<List<Content>>> GetAll()
		{
			// Surround with try/catch:
			try
			{
				// Get all users:
				var content = await _content.FindAsync(x => true);
				// Convert to list:
				var contentList = await content.ToListAsync();
				// Return DTO with encapsulated data:
				return new DTO<List<Content>>()
				{
					Data = contentList,
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
		/// <param name="index">Index of object of type string.</param>
		/// <returns>DTO encapsulating a List of type User.</returns>
		public async Task<DTO<List<Content>>> Get(string index)
		{
			// Surround with try/catch:
			try
			{
				// Get first user with the specified id:
				var content = await _content.FindAsync(x => x.Id.Equals(index));
				// Grab the first or default of the result:
				var foundContent = await content.FirstOrDefaultAsync();
				// Return DTO with encapsulated data:
				return new DTO<List<Content>>()
				{
					Data = new List<Content>() { foundContent },
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
		/// <param name="newContent">Object to be added of type generic.</param>
		/// <returns>DTO encapsulating a List of type User.</returns>
		public async Task<DTO<List<Content>>> Add(Content newContent)
		{
			// Surround with try/catch:
			try
			{
				// Insert User into the collection:
				await _content.InsertOneAsync(newContent);
				// Return DTO with encapsulated data:
				return new DTO<List<Content>>()
				{
					Data = new List<Content>() { newContent },
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
		/// <param name="index">Index of object of type string.</param>
		/// <param name="updatedContent">Object to be updated of type generic.</param>
		/// <returns>DTO encapsulating a List of type User.</returns>
		public async Task<DTO<List<Content>>> Update(string index, Content updatedContent)
		{
			// Surround with try/catch:
			try
			{
				// Replace the user in the collection that matches the id passed in with the specified updated user:
				await _content.ReplaceOneAsync(x => x.Id.Equals(index), updatedContent);
				// Return DTO with encapsulated data:
				return new DTO<List<Content>>()
				{
					Data = new List<Content>() { updatedContent },
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
		/// <param name="index">Index of object of type string.</param>
		/// <returns>DTO encapsulating a List of type User.</returns>
		public async Task<DTO<List<Content>>> Delete(string index)
		{
			// Surround with try/catch:
			try
			{
				// Delete the user in the collection that matches the id:
				await _content.DeleteOneAsync(x => x.Id.Equals(index));
				// Return DTO with encapsulated data:
				return new DTO<List<Content>>()
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
