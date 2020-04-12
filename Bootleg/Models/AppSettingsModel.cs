
// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

using System.ComponentModel;

namespace Bootleg.Models
{
    /// <summary>
    /// AppSettings class for encapsulating site-wide static values.
    /// </summary>
    public class AppSettingsModel
    {
        /// <summary>
		/// Static object that will hold the application settings.
		/// </summary>
		[Description("Static object that will hold the application settings.")]
        public static AppSettingsModel AppSettings { get; set; }
		/// <summary>
		/// String that will hold the secret for JWT encoding/decoding.
		/// </summary>
		[Description("String that will hold the secret for JWT encoding/decoding.")]
		public string JwtSecret { get; set; }
		/// <summary>
		/// String that will hold the application domain name.
		/// </summary>
		[Description("String that will hold the application domain name.")]
		public string AppDomain { get; set; }
		/// <summary>
		/// String that will hold the application audience.
		/// </summary>
		[Description("String that will hold the application audience.")]
		public string AppAudience { get; set; }
	}
}