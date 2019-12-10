﻿using Microsoft.ML.Data;

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
		[ColumnName("Sentiment"), LoadColumn(0)]
		public string Sentiment { get; set; }

		[ColumnName("Label"), LoadColumn(1)]
		public bool Label { get; set; }
	}
}
