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
using Bootleg.Models.DTO;
using System.Collections.Generic;

namespace Bootleg
{
	public class Startup
	{
		public Startup(IWebHostEnvironment env)
		{
			var builder = new ConfigurationBuilder()
				.SetBasePath(env.ContentRootPath)
				.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
				.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
				.AddEnvironmentVariables();
			Configuration = builder.Build();
			CurrentEnvironment = env;
		}

		public IConfiguration Configuration { get; }
		private IWebHostEnvironment CurrentEnvironment { get; set; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
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

            services.AddControllersWithViews(options =>
            {
                options.Filters.Add(typeof(ValidateModelStateAttribute));
            }).AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });

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

			services.Configure<CookiePolicyOptions>(options =>
			{
				options.CheckConsentNeeded = context => true;
				options.MinimumSameSitePolicy = SameSiteMode.None;
			});

			services.AddPredictionEnginePool<PredictionInput, PredictionOutput>()
				.FromFile(modelName: "MLModel", filePath: Configuration["MLModels:SentimentMLModelFilePath"], watchForChanges: true);

			// Inject dependencies here:
			// Change development environment here (connection string to db or anything else necessary):
			if (CurrentEnvironment.IsDevelopment())
			{
				services.AddSingleton<IDAO<User, DTO<List<User>>>>(service => new UserDAO(
					Configuration["ConnectionStrings:LocalMongoDBConnection"],
					Configuration["ConnectionStrings:LocalMongoDBDatabase"],
					Configuration["ConnectionStrings:LocalMongoDBCollection"]));
			}
			else
			{
				services.AddSingleton<IDAO<User, DTO<List<User>>>>(service => new UserDAO(
					Configuration["ConnectionStrings:HerokuMongoDBConnection"],
					Configuration["ConnectionStrings:HerokuMongoDBDatabase"],
					Configuration["ConnectionStrings:HerokuMongoDBCollection"]));
			}

			services.AddSingleton<IAuthenticationService, AuthenticationService>();
			services.AddSingleton<IPredictionService, PredictionService>();

			// In production, the React files will be served from this directory:
			services.AddSpaStaticFiles(configuration =>
			{
				configuration.RootPath = "ClientApp/build";
			});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseSpaStaticFiles();
			app.UseCors();
			app.UseRouting();
			app.UseAuthentication();
			app.UseAuthorization();
			app.UseCookiePolicy();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllerRoute(
					name: "default",
					pattern: "{controller}/{action=Index}/{id?}");
			});

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