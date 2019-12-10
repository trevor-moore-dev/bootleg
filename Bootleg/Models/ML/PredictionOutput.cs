using Microsoft.ML.Data;

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

namespace Bootleg.Models.ML
{
	/// <summary>
	/// Prediction output class for holding the ouput of our ML model(s).
	/// </summary>
	public class PredictionOutput
	{
		[ColumnName("PredictedLabel")]
		public bool Prediction { get; set; }

		public float Score { get; set; }
	}
}
