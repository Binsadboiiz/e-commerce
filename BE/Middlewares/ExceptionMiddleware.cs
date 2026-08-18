namespace BE.Middlewares
{
    /// <summary>
    /// Global exception handling middleware to catch unhandled exceptions, format error responses,
    /// and prevent sensitive server information disclosure in non-development environments.
    /// </summary>
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (AppException ex)
            {
                // Custom business application exceptions (safe to expose message)
                context.Response.StatusCode = ex.StatusCode;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new
                {
                    status = false,
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                // Log unhandled server errors internally
                _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);

                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";

                // Expose internal exception details ONLY in Development environment to prevent Information Disclosure
                var response = new
                {
                    status = false,
                    message = "An unexpected error occurred on the server. Please try again later.",
                    detail = _env.IsDevelopment() ? ex.Message : null
                };

                await context.Response.WriteAsJsonAsync(response);
            }
        }
    }
}