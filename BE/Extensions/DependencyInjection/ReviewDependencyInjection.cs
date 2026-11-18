using BE.Repositories.Implementations.Reviews;
using BE.Repositories.Interfaces.Reviews;
using BE.Services.Implementation.Reviews;
using BE.Services.Interface.Review;
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
