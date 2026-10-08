using BE.Repositories.Implementations.Admin;
using BE.Repositories.Interfaces.Admin;
using BE.Services.Implementation.Admin;
using BE.Services.Interface.Admin;
using Microsoft.Extensions.DependencyInjection;

namespace BE.Extensions.DependencyInjection
{
    public static class AdminDependencyInjection
    {
        public static IServiceCollection AddAdminModule(this IServiceCollection services)
        {
            services.AddScoped<IAdminDashboardRepository, AdminDashboardRepository>();
            services.AddScoped<IAdminDashboardService, AdminDashboardService>();
            services.AddScoped<IRedirectService, RedirectService>();
            
            return services;
        }
    }
}
