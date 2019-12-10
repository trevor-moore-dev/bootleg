
// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

namespace Bootleg.Models
{
    /// <summary>
    /// AppSettings class for encapsulating site-wide static values.
    /// </summary>
    public class AppSettingsModel
    {
        public static AppSettingsModel AppSettings { get; set; }
        public string JwtSecret { get; set; }
		public string AppDomain { get; set; }
		public string AppAudience { get; set; }
	}
}