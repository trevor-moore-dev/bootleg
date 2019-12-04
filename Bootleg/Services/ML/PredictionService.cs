using Microsoft.Extensions.ML;
using Bootleg.Models.ML;
using Bootleg.Services.ML.Interfaces;

namespace Bootleg.Services.ML
{
	public class PredictionService : IPredictionService
	{
		private readonly PredictionEnginePool<PredictionInput, PredictionOutput> _predictionEnginePool;

		public PredictionService(PredictionEnginePool<PredictionInput, PredictionOutput> predictionEnginePool)
		{
			_predictionEnginePool = predictionEnginePool;
		}

		public PredictionOutput Predict(PredictionInput input)
		{
			return _predictionEnginePool.Predict(modelName: "MLModel", example: input);
		}
	}
}
