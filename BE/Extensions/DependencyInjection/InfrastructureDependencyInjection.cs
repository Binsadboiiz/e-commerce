using BE.Data;
using BE.Services.Implementation;
using BE.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace BE.Extensions.DependencyInjection;

/// <summary>
/// Registers infrastructure dependencies.
/// </summary>
public static class InfrastructureExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseMySql(
                configuration.GetConnectionString("DefaultConnection"),
                ServerVersion.AutoDetect(
                    configuration.GetConnectionString("DefaultConnection"))
            ));

        services.AddScoped<ICloudinaryService, CloudinaryService>();

        services.AddMemoryCache();

        return services;
    }
}