using BE.Services.Implementation;
using BE.Services.Interface;

namespace BE.Extensions.DependencyInjection;

/// <summary>
/// Registers order module dependencies.
/// </summary>
public static class OrderModuleExtensions
{
    public static IServiceCollection AddOrderModule(
        this IServiceCollection services)
    {
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IOrderTrackingService, OrderTrackingService>();

        return services;
    }
}