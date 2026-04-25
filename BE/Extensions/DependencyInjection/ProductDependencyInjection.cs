using BE.Repositories.Implementations;
using BE.Repositories.Interfaces;
using BE.Services.Implementation;
using BE.Services.Interface.Product;

namespace BE.Extensions.DependencyInjection
{
    /// <summary>
    /// Registers product module dependencies.
    /// </summary>
    public static class ProductDependencyInjection
    {
        public static IServiceCollection AddProductModule (this IServiceCollection services)
        {
            // repositories
            services.AddScoped<IProductRepository, ProductRepository>();

            // services
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IProductQueryService, ProductQueryService>();
            services.AddScoped<IProductDomainService, ProductDomainService>();

            return services;
        }
    }
}
