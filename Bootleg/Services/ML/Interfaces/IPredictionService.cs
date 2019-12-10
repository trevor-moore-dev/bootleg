using Bootleg.Models.ML;

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

namespace Bootleg.Services.ML.Interfaces
{
	/// <summary>
	/// Interface for defining the contract of the prediction service.
	/// </summary>
	public interface IPredictionService
	{
		/// <summary>
		/// Method for making a prediction using our ML model(s).
		/// </summary>
		/// <param name="input">Input of type PredictionInput.</param>
		/// <returns>PredictionOutput with score.</returns>
		PredictionOutput Predict(PredictionInput input);
	}
}
