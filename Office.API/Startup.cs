using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using AutoMapper;
using Office.API.Data;
using Office.API.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Office.API.Websockets;

namespace Office.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment environment)
        {
            Configuration = configuration;
            _environment = environment;
        }

        public IConfiguration Configuration { get; }

        readonly IHostingEnvironment _environment;

        bool IsDevelopment
        {
            get
            {
                return _environment.IsDevelopment();
            }
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(x => 
            {        
                //x.UseSqlServer(Configuration.GetSection("ConnectionStrings:DefaultConnection").Value);  

                if(IsDevelopment)
                    x.UseSqlServer(Configuration.GetSection("ConnectionStrings:DefaultConnection").Value);
                    else
                    x.UseSqlServer(Configuration.GetSection("ConnectionStrings:ReleaseConnection").Value);
            });
          
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddJsonOptions(o=>
                {
                    o.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });
            services.AddCors();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.Configure<RequestLocalizationOptions>(
            opts =>
            {
                var supportedCultures = new List<CultureInfo>
                {
                    new CultureInfo("pl-PL"),
                    new CultureInfo("pl"),
                };

                opts.DefaultRequestCulture = new RequestCulture("en-GB");
                opts.SupportedCultures = supportedCultures;
                opts.SupportedUICultures = supportedCultures;
            });
        
        

            services.AddScoped<IAuthRepository, AuthRepository>();
            
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>{
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes( Configuration.GetSection("AppSettings:Token").Value)),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddScoped<IOfficeRepository, OfficeRepository>();
            var provider = services.BuildServiceProvider();
            services.AddTransient<Hub>(x => new Hub(
                provider.GetService<DataContext>()
            ));

            // services.AddTransient<Seed>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, DataContext _dbContext, Hub hub)
        {
                app.UseDeveloperExceptionPage();
                app.UseExceptionHandler(builder => {
                builder.Run(async context => {

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                
                var error = context.Features.Get<IExceptionHandlerFeature>();

                if(error != null)
                {
                    context.Response.AddApplicationError(error.Error.Message);
                    await context.Response.WriteAsync(error.Error.Message);
                }

                });

            var webSocketOptions = new WebSocketOptions() 
            {
                KeepAliveInterval = TimeSpan.FromSeconds(120),
                ReceiveBufferSize = 4 * 1024
            };

            app.UseWebSockets(webSocketOptions);
            });
            
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseAuthentication();
            if(!IsDevelopment) 
            {
                app.UseDefaultFiles();
                app.UseStaticFiles();
                app.UseMvc(routes => {
                    routes.MapSpaFallbackRoute(
                        name: "spa-fallback",
                        defaults: new {controller = "Fallback", Action= "Index"}
                    );
                });
            }
            else
            {
                app.UseMvc();
                //DbInitializer.Initialize(_dbContext); 
            }
            
            app.Use(async (httpContext, next) =>
            {
                if (httpContext.Request.Path == "/ws")
                {
                    if (httpContext.WebSockets.IsWebSocketRequest)
                    {
                        WebSocket webSocket = await httpContext.WebSockets.AcceptWebSocketAsync();
                        await hub.OpenConnection(httpContext, webSocket);
                         //await Messenger.Echo(httpContext, webSocket);
                    }
                    else
                    {
                        httpContext.Response.StatusCode = 400; 
                    }
                }
                else
                {
                    await next();
                }

            });          
        }


    }
}
    

