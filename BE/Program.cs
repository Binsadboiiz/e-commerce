using BE.Data;
using BE.Middlewares;
using BE.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// DI configuration: Extensions/DependencyInjection/

// ── Infrastructure ──
builder.Services.AddInfrastructure(builder.Configuration);

// ── Feature Modules ──
builder.Services.AddProductModule();
builder.Services.AddOrderModule();
builder.Services.AddCartModule();

// ── CORS ──
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.WebHost.UseUrls("https://localhost:5269");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ExceptionMiddleware>();

// CORS must come before Authorization and Controllers
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();


// ================== LOG STARTUP ==================
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var dbContext = services.GetRequiredService<ApplicationDbContext>();

        // thử connect DB
        var canConnect = dbContext.Database.CanConnect();

        // lấy port server
        var urls = app.Urls.Any()
            ? string.Join(", ", app.Urls)
            : "Unknown";

        Console.WriteLine("=======================================");
        Console.WriteLine($" -Server is running at: {urls}");
        Console.WriteLine($" -Environment: {app.Environment.EnvironmentName}");

        if (canConnect)
            Console.WriteLine(" -Database: Connected ✓");
        else
            Console.WriteLine(" -Database: Connection FAILED ✗");

        Console.WriteLine("=======================================");
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error when connecting DB:");
        Console.WriteLine(ex.Message);
    }
}
// ===================================================

app.Run();