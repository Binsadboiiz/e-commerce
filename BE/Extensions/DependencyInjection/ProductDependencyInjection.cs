using BE.Repositories.Implementations.Categories;
using BE.Repositories.Implementations.Products;
using BE.Repositories.Interfaces.Categories;
using BE.Repositories.Interfaces.Products;
using BE.Services.Implementation.Categories;
using BE.Services.Implementation.Products;
using BE.Services.Interface.Category;
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
            services.AddScoped<ICategoryRepository, CategoryRepository>();

            // services
            services.AddScoped<IProductCreationService, ProductCreationService>();
            services.AddScoped<IProductUpdateService, ProductUpdateService>();
            services.AddScoped<ISellerProductService, SellerProductService>();
            services.AddScoped<IProductQueryService, ProductQueryService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<ISearchSuggestionService, SearchSuggestionService>();

            return services;
        }
    }
}
