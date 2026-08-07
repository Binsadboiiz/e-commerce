using BE.Repositories.Implementations;
using BE.Repositories.Interfaces;
using BE.Services.Implementation.Seller;
using BE.Services.Interface.Seller;
using Microsoft.Extensions.DependencyInjection;

namespace BE.Extensions.DependencyInjection
{
    public static class SellerDependencyInjection
    {
        public static IServiceCollection AddSellerModule(this IServiceCollection services)
        {
            // Repository
            services.AddScoped<ISellerRepository, SellerRepository>();

            // Services
            services.AddScoped<ISellerRegistrationService, SellerRegistrationService>();
            services.AddScoped<ISellerDocumentService, SellerDocumentService>();
            services.AddScoped<ISellerHeaderService, SellerHeaderService>();
            services.AddScoped<ISellerDashboardService, SellerDashboardService>();

            return services;
        }
    }
}
