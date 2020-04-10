using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.ML;
using Bootleg.Models.ML;
using Bootleg.Services.Data;
using System.Text;
using Bootleg.Services.ML;
using Bootleg.Services.ML.Interfaces;
using Bootleg.Attributes;
using Newtonsoft.Json;
using Bootleg.Services.Data.Interfaces;
using Bootleg.Services.Business.Interfaces;
using Bootleg.Models.Documents;
using Bootleg.Services.Business;
using Microsoft.Extensions.FileProviders;
using System.IO;
using SecretSanta2._0.Services.Hubs;
using Microsoft.OpenApi.Models;
using System;

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

namespace Bootleg
{
	/// <summary>
	/// Auto-generated Startup class that gets executed during container startup.
	/// </summary>
	public class Startup
	{
		/// <summary>
		/// Auto-generated constructor for Startup class.
		/// </summary>
		/// <param name="env">Env of type IWebHostEnvironment.</param>
		public Startup(IWebHostEnvironment env)
		{
			// Create our configuration builder using our app settings file.
			var builder = new ConfigurationBuilder()
				.SetBasePath(env.ContentRootPath)
				.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
				.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
				.AddEnvironmentVariables();
			// Set our configuration and current evironment:
			Configuration = builder.Build();
			CurrentEnvironment = env;
		}
		public IConfiguration Configuration { get; }
		private IWebHostEnvironment CurrentEnvironment { get; set; }
		/// <summary>
		/// Auto-generated ConfigureServices() method that gets called by the runtime. Use this method to add services to the container.
		/// </summary>
		/// <param name="services">Services of type IServiceCollection</param>
		public void ConfigureServices(IServiceCollection services)
		{
			// Add CORS to our services:
			services.AddCors(options =>
			{
				options.AddDefaultPolicy(
					policy =>
					{
						policy.AllowAnyHeader();
						policy.AllowAnyMethod();
						policy.SetIsOriginAllowed((host) => true);
						policy.AllowCredentials();
					});
			});
			// Add controllers with views to our services, specifiying to use our ModelState Validator Attribute:
            services.AddControllersWithViews(options =>
            {
                options.Filters.Add(typeof(ValidateModelStateAttribute));
            })
			// Add Newtonsoft Json for input/output formatting/serializing:
			.AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });
			// Add Swashbuckle Swagger generation:
			services.AddSwaggerGen(c =>
			{
				c.SwaggerDoc("v1", new OpenApiInfo
				{
					Version = "v1",
					Title = "Bootleg API",
					Description = "ASP.NET Core Web API for Bootleg",
					TermsOfService = new Uri("https://trevormoore.dev/"),
					Contact = new OpenApiContact
					{
						Name = "Trevor Moore",
						Email = "TMMooreGCU@gmail.com",
						Url = new Uri("https://www.youtube.com/watch?v=6-HUgzYPm9g"),
					},
					License = new OpenApiLicense
					{
						Name = "Use under MIT",
						Url = new Uri("https://opensource.org/licenses/MIT"),
					}
				});
			});
			// Add Authentication and a JWT Bearer that will use our secret key for decrypting tokens:
			services.AddAuthentication()
				.AddJwtBearer(cfg =>
				{
					cfg.RequireHttpsMetadata = false;
					cfg.SaveToken = true;

					cfg.TokenValidationParameters = new TokenValidationParameters()
					{
						ValidIssuer = Configuration["AppSettings:AppDomain"],
						ValidAudiences = new[] { Configuration["AppSettings:AppAudience"] },
						IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["AppSettings:JwtSecret"])),
						ValidateIssuer = true,
						ValidateAudience = true,
						ValidateIssuerSigningKey = true
					};
				});
			// Set Cookie policy rules:
			services.Configure<CookiePolicyOptions>(options =>
			{
				options.CheckConsentNeeded = context => true;
				options.MinimumSameSitePolicy = SameSiteMode.None;
			});
			// Inject dependencies here:
			// Inject our PredictionEnginePool:
			services.AddPredictionEnginePool<PredictionInput, PredictionOutput>()
				.FromFile(modelName: "MLModel", filePath: Configuration["MLModels:SentimentMLModelFilePath"], watchForChanges: true);
			// Add SignalR for web sockets:
			services.AddSignalR();
			// Change development environment here (connection string to db or anything else necessary):
			if (CurrentEnvironment.IsDevelopment())
			{
				// Inject our DAOs as Singletons using our DEV parameters:
				services.AddSingleton<IDAO<User>>(service => new UserDAO(
					Configuration["ConnectionStrings:LocalMongoDBConnection"],
					Configuration["ConnectionStrings:MongoDBDatabase"],
					Configuration["ConnectionStrings:MongoDBCollectionOne"]));
				services.AddSingleton<IDAO<Content>>(service => new ContentDAO(
					Configuration["ConnectionStrings:LocalMongoDBConnection"],
					Configuration["ConnectionStrings:MongoDBDatabase"],
					Configuration["ConnectionStrings:MongoDBCollectionTwo"]));
				services.AddSingleton<IDAO<Conversation>>(service => new ConversationDAO(
					Configuration["ConnectionStrings:LocalMongoDBConnection"],
					Configuration["ConnectionStrings:MongoDBDatabase"],
					Configuration["ConnectionStrings:MongoDBCollectionThree"]));
			}
			else
			{
				// Inject our DAO as a Singleton using our LIVE parameters:
				services.AddSingleton<IDAO<User>>(service => new UserDAO(
					Configuration["ConnectionStrings:AzureMongoDBConnection"],
					Configuration["ConnectionStrings:MongoDBDatabase"],
					Configuration["ConnectionStrings:MongoDBCollectionOne"]));
				services.AddSingleton<IDAO<Content>>(service => new ContentDAO(
					Configuration["ConnectionStrings:AzureMongoDBConnection"],
					Configuration["ConnectionStrings:MongoDBDatabase"],
					Configuration["ConnectionStrings:MongoDBCollectionTwo"]));
				services.AddSingleton<IDAO<Conversation>>(service => new ConversationDAO(
					Configuration["ConnectionStrings:AzureMongoDBConnection"],
					Configuration["ConnectionStrings:MongoDBDatabase"],
					Configuration["ConnectionStrings:MongoDBCollectionThree"]));
			}
			// Inject our Blob service as a Singleton:
			services.AddSingleton<IBlobService, BlobService>(service => new BlobService(
				Configuration["ConnectionStrings:AzureBlobStorageConnection"],
				Configuration["ConnectionStrings:BlobStorageContainer"]));
			// Inject our Authentication service as a Singleton:
			services.AddSingleton<IAuthenticationService, AuthenticationService>();
			// Inject our User service as a Singleton:
			services.AddSingleton<IUserService, UserService>();
			// Inject our Content service as a Singleton:
			services.AddSingleton<IContentService, ContentService>();
			// Inject our Conversation service as a Singleton:
			services.AddSingleton<IConversationService, ConversationService>();
			// Inject our Prediction service as a Singleton:
			services.AddSingleton<IPredictionService, PredictionService>();
			// In production, the React files will be served from this directory:
			services.AddSpaStaticFiles(configuration =>
			{
				configuration.RootPath = "ClientApp/build";
			});
		}
		/// <summary>
		/// Auto-generated Configure() method that gets called by the runtime. Use this method to configure the HTTP request pipeline.
		/// </summary>
		/// <param name="app">App of type IApplicationBuilder.</param>
		/// <param name="env">Environment of type IWebHostEnvironment.</param>
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			// Use swagger for API documentation generation using Swashbuckle:
			app.UseSwagger();
			app.UseSwaggerUI(c =>
			{
				c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
			});

			// If DEV environment use the DEV exception page:
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			// Else use the Error page:
			else
			{
				app.UseExceptionHandler("/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}
			// Add https redirection, static file serving, SPA static files, CORS, routing, authentication, authorization, and cookie policy to our app:
			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseSpaStaticFiles();
			app.UseCors();
			app.UseRouting();
			app.UseAuthentication();
			app.UseAuthorization();
			app.UseCookiePolicy();
			app.UseStaticFiles(new StaticFileOptions
			{
				FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Resources", "Images")),
				RequestPath = "/Resources/Images"
			});
			// Specify to use endpoints on our app with route pattern:
			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllerRoute(
					name: "default",
					pattern: "{controller}/{action=Index}/{id?}");
				endpoints.MapHub<ConversationHub>("/ConversationHub");
			});
			// Specify to use SPA and source path:
			app.UseSpa(spa =>
			{
				spa.Options.SourcePath = "ClientApp";

				if (env.IsDevelopment())
				{
					spa.UseReactDevelopmentServer(npmScript: "start");
				}
			});
		}
	}
}