using BE.Repositories.Interfaces;
using BE.Repositories.Implementations;
using BE.Services.Interface;
using BE.Services.Implementation;
using BE.Helpers;


namespace BE.Extensions.DependencyInjection
{
    public static class AuthModuleExtensions
    {
        public static IServiceCollection AddAuthModule(
            this IServiceCollection services)
        {
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<JWTHelper>();

            return services;
        }
    }
}