using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace BE.Extensions
{
    public static class JwtExtension
    {
        /// <summary>
        /// Configures JWT Bearer authentication service for the ASP.NET Core application.
        /// Supports token extraction from both the 'Authorization: Bearer' header and HttpOnly 'accessToken' cookie.
        /// </summary>
        public static IServiceCollection AddJwtAuthentication(
            this IServiceCollection services, IConfiguration configuration)
        {
            var secretKey = configuration["JWT:Secret"];
            if (string.IsNullOrWhiteSpace(secretKey))
            {
                throw new InvalidOperationException("JWT:Secret configuration key is missing or empty. Please set it in appsettings or Environment Variables.");
            }

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ClockSkew = TimeSpan.Zero, // Remove default 5-minute clock skew for precise token expiration check

                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(secretKey))
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            // First check if token exists in Authorization header (standard Bearer scheme)
                            string? authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                            {
                                context.Token = authHeader.Substring("Bearer ".Length).Trim();
                            }
                            // Fallback to reading token from HttpOnly cookie 'accessToken'
                            else if (context.Request.Cookies.ContainsKey("accessToken"))
                            {
                                context.Token = context.Request.Cookies["accessToken"];
                            }

                            return Task.CompletedTask;
                        }
                    };
                }
            );

            services.AddAuthorization();

            return services;
        }
    }
}