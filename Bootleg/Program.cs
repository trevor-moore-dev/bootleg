using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Bootleg.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

namespace Bootleg
{
	/// <summary>
	/// Auto-generated Program class.
	/// </summary>
	public class Program
	{
		/// <summary>
		/// Auto-generated Main() method that gets executed during container initialization.
		/// </summary>
		/// <param name="args">Args of type string array.</param>
		public static void Main(string[] args)
		{
			// Initialize our logger:
			Log.Logger = new LoggerConfiguration()
				.MinimumLevel.Debug()
				.WriteTo.Console()
				.CreateLogger();
			// Logged that we are starting our service:
			Helpers.LoggerHelper.Log("Starting Service");
			// Read our app settings file:
			string json = File.ReadAllText(@"appsettings.json");
			// Parse the json:
			JObject o = JObject.Parse(@json);
			// Serialize the json result of the file into an AppSettings object:
			AppSettingsModel.AppSettings = JsonConvert.DeserializeObject<AppSettingsModel>(o["AppSettings"].ToString());
			// Run our web app:
			CreateWebHostBuilder(args).Build().Run();
		}
		/// <summary>
		/// Auto-generated CreateWebHostBuilder() method that creates a web host for building web apps.
		/// </summary>
		/// <param name="args">Args of type string array.</param>
		/// <returns>Web Host Builder of type IWebHostBuilder.</returns>
		public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
			WebHost.CreateDefaultBuilder(args)
				.UseStartup<Startup>();
	}
}