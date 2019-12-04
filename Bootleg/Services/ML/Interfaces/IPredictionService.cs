using Bootleg.Models.ML;

namespace Bootleg.Services.ML.Interfaces
{
	public interface IPredictionService
	{
		PredictionOutput Predict(PredictionInput input);
	}
}
