using Microsoft.ML.Data;
using System.ComponentModel;

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
		/// <summary>
		/// The bool value of the prediction of the binary analysis.
		/// </summary>
		[Description("The bool value of the prediction of the binary analysis.")]
		[ColumnName("PredictedLabel")]
		public bool Prediction { get; set; }
		/// <summary>
		/// The score of where the prediction falls on the positive/negative spectrum (as a float).
		/// </summary>
		[Description("The score of where the prediction falls on the positive/negative spectrum (as a float).")]
		public float Score { get; set; }
	}
}
