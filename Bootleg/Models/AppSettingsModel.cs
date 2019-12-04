namespace Bootleg.Models
{
    public class AppSettingsModel
    {
        public static AppSettingsModel AppSettings { get; set; }
        public string JwtSecret { get; set; }
		public string AppDomain { get; set; }
		public string AppAudience { get; set; }
	}
}