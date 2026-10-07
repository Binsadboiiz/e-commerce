using BE.Data;
using BE.Middlewares;
using BE.Extensions.DependencyInjection;
using BE.Extensions;

using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;


var builder = WebApplication.CreateBuilder(args);

// DI configuration: Extensions/DependencyInjection/

// ── Infrastructure ──
builder.Services.AddInfrastructure(builder.Configuration);

// ── Feature Modules ──
builder.Services.AddProductModule();
builder.Services.AddOrderModule();
builder.Services.AddCartModule();
builder.Services.AddAuthModule();
builder.Services.AddReviewModule();
builder.Services.AddSellerModule();
builder.Services.AddAdminModule();


// ── JWT Authentication ──
builder.Services.AddJwtAuthentication(builder.Configuration);

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
// ── Rate Limiting ──
// Configures IP-partitioned fixed window rate limiting policies to prevent brute-force attacks and service abuse.
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Custom response handler when a client exceeds rate limits
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            status = false,
            message = "Too many requests. Please slow down and try again later."
        }, cancellationToken: cancellationToken);
    };

    // 1. Auth Policy: Strict limit of 10 requests per minute per IP (for login & register endpoints)
    options.AddPolicy("AuthPolicy", httpContext => 
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 1,
                AutoReplenishment = true
            }
        ));

    // 2. Upload Policy: Limit of 10 image uploads per minute per IP
    options.AddPolicy("UploadPolicy", httpContext => 
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true
            }
        ));

    // 3. General API Policy: Standard limit of 60 requests per minute per IP
    options.AddPolicy("GeneralPolicy", httpContext => 
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 60,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 2,
                AutoReplenishment = true
            }
        ));

        // 4. Place order Policy: Limit of 5 place order request per minute per IP
        options.AddPolicy("PlaceOrder", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknow",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 30,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 1,
                AutoReplenishment = true
            }
        ));
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

// CORS must be executed before Authentication & Authorization
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

// UseAuthentication validates JWT tokens/cookies and populates ClaimsPrincipal (User)
app.UseAuthentication();

// Rate Limiter middleware evaluates request limits before authorization checks
app.UseRateLimiter();

// UseAuthorization enforces policy and role-based access control [Authorize]
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