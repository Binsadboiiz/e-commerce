using BE.Services.Implementation.Inventories;
using BE.Services.Implementation.Orders;
using BE.Services.Implementation.Users;
using BE.Services.Interface.Inventory;
using BE.Services.Interface.Order;
using BE.Services.Interface.User;

namespace BE.Extensions.DependencyInjection;

/// <summary>
/// Registers order module dependencies.
/// </summary>
public static class OrderDependencyInjection
{
    public static IServiceCollection AddOrderModule(
        this IServiceCollection services)
    {
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IInventoryService, InventoryService>();
        services.AddScoped<IOrderTrackingService, OrderTrackingService>();
        services.AddScoped<IUserAddressService, UserAddressService>();

        return services;
    }
}
