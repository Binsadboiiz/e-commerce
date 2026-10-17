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
                var traceId = context.TraceIdentifier;
                // Log unhandled server errors internally
                _logger.LogError(ex, "Unhandled exception. TraceId: {TraceId}", traceId);

                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/json";

                // Expose internal exception details ONLY in Development environment to prevent Information Disclosure
                await context.Response.WriteAsJsonAsync(new
                {
                    status = false,
                    message = "An unexpected error occurred",
                    traceId,
                    detail = _env.IsDevelopment() ? ex.Message : null
                });
            }
        }
    }
}