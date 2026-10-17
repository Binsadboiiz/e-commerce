using BE.Services.Implementation.Carts;
using BE.Services.Interface.Cart;
using BE.Services.Interface.Inventory;

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