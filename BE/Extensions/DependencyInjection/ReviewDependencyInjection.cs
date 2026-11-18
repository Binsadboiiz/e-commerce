using BE.Repositories.Implementations;
using BE.Repositories.Interfaces;
using BE.Services.Implementation.Review;
using BE.Services.Interface;
using Microsoft.Extensions.DependencyInjection;

namespace BE.Extensions.DependencyInjection
{
    public static class ReviewDependencyInjection
    {
        public static IServiceCollection AddReviewModule(this IServiceCollection services)
        {
            // Repository
            services.AddScoped<IReviewRepository, ReviewRepository>();

            // Service
            services.AddScoped<IReviewQueryService, ReviewQueryService>();

            return services;
        }
    }
}