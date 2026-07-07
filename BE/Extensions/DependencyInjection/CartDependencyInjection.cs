using BE.Services.Implementation;
using BE.Services.Interface;

namespace BE.Extensions.DependencyInjection;

/// <summary>
/// Registers cart module dependencies.
/// </summary>
public static class CartDependencyInjection
{
    public static IServiceCollection AddCartModule(
        this IServiceCollection services)
    {
        services.AddScoped<ICartService, CartService>();

        return services;
    }
}