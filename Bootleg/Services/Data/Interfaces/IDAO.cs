using System.Threading.Tasks;

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

namespace Bootleg.Services.Data.Interfaces
{
	/// <summary>
	/// Interface for defining the contract of every data access object.
	/// </summary>
	public interface IDAO<O, D>
	{
		/// <summary>
		/// Method for getting all data.
		/// </summary>
		/// <returns>Generic object.</returns>
		Task<D> GetAll();
		/// <summary>
		/// Method that will get a document from the database.
		/// </summary>
		/// <param name="idx">Index of object of type string.</param>
		/// <returns>Generic object.</returns>
		Task<D> Get(string idx);
		/// <summary>
		/// Method that will add the document to the database.
		/// </summary>
		/// <param name="obj">Object to be added of type generic.</param>
		/// <returns>Generic object.</returns>
		Task<D> Add(O obj);
		/// <summary>
		/// Method that will update the document in the database.
		/// </summary>
		/// <param name="idx">Index of object of type string.</param>
		/// <param name="obj">Object to be updated of type generic.</param>
		/// <returns>Generic object.</returns>
		Task<D> Update(string idx, O obj);
		/// <summary>
		/// Method that will delete the document from the database.
		/// </summary>
		/// <param name="idx">Index of object of type string.</param>
		/// <returns>Generic object.</returns>
		Task<D> Delete(string idx);
	}
}