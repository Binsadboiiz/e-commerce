using BE.Repositories.Interfaces.Auth;
using BE.Repositories.Implementations.Auth;
using BE.Services.Interface.Auth;
using BE.Services.Implementation.Auth;
using BE.Helpers;


namespace BE.Extensions.DependencyInjection
{
    public static class AuthDependencyInjection
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
