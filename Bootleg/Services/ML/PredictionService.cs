using Microsoft.Extensions.ML;
using Bootleg.Models.ML;
using Bootleg.Services.ML.Interfaces;

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

namespace Bootleg.Services.ML
{
	/// <summary>
	/// Prediction service for utilizing an ML model and .NET's PredictionEnginePool. Implements the IPredictionService interface.
	/// </summary>
	public class PredictionService : IPredictionService
	{
		// Private readonly PredictionEnginePool for holding all our engines:
		private readonly PredictionEnginePool<PredictionInput, PredictionOutput> _predictionEnginePool;
		/// <summary>
		/// Constructor for setting our engine pool.
		/// </summary>
		/// <param name="predictionEnginePool">Engine pool of type PredictionEnginePool<PredictionInput, PredictionOutput>.</param>
		public PredictionService(PredictionEnginePool<PredictionInput, PredictionOutput> predictionEnginePool)
		{
			// Set our engine pool:
			_predictionEnginePool = predictionEnginePool;
		}
		/// <summary>
		/// Method for making a prediction using our ML model(s).
		/// </summary>
		/// <param name="input">Input of type PredictionInput.</param>
		/// <returns>PredictionOutput with score.</returns>
		public PredictionOutput Predict(PredictionInput input)
		{
			// Return result of prediction using our engine pool and specified ML model:
			return _predictionEnginePool.Predict(modelName: "MLModel", example: input);
		}
	}
}
