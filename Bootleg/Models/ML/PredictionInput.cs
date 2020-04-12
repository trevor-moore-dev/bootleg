using Microsoft.ML.Data;
using System.ComponentModel;

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

namespace Bootleg.Models.ML
{
	/// <summary>
	/// Prediction input class for holding the input for our ML model(s).
	/// </summary>
	public class PredictionInput
	{
		/// <summary>
		/// The string value that will be analyzed.
		/// </summary>
		[Description("The string value that will be analyzed.")]
		[ColumnName("Sentiment"), LoadColumn(0)]
		public string Sentiment { get; set; }
		/// <summary>
		/// The label of what the anaylzed string is, where it be positive/negative in the binary analysis.
		/// </summary>
		[Description("The label of what the anaylzed string is, where it be positive/negative in the binary analysis.")]
		[ColumnName("Label"), LoadColumn(1)]
		public bool Label { get; set; }
	}
}
