using BE.Services.Interface.Admin;

namespace BE.Middlewares
{
    public class RedirectMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RedirectMiddleware> _logger;

        private static readonly HashSet<string> IgnoredExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".js", ".css", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".woff", ".woff2", ".ttf", ".eot", ".json", ".xml", ".webp"
        };

        public RedirectMiddleware(RequestDelegate next, ILogger<RedirectMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, IRedirectService redirectService)
        {
            var path = context.Request.Path.Value;
            var queryString = context.Request.QueryString.Value;

            if (!string.IsNullOrEmpty(path) && 
                !path.StartsWith("/api", StringComparison.OrdinalIgnoreCase) && 
                !path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase))
            {
                var extension = Path.GetExtension(path);
                if (string.IsNullOrEmpty(extension) || !IgnoredExtensions.Contains(extension))
                {
                    var fullPathWithQuery = string.Concat(path, queryString);
                    var matchRule = await redirectService.GetMatchingRedirectAsync(fullPathWithQuery) ??
                                    await redirectService.GetMatchingRedirectAsync(path);

                    if (matchRule != null && matchRule.IsActive)
                    {
                        _logger.LogInformation("[Redirect Engine] Redirecting {Source} -> {Target} ({StatusCode})", path, matchRule.TargetUrl, matchRule.StatusCode);

                        // Fire-and-forget update hit count
                        _ = redirectService.IncrementHitCountAsync(matchRule.Id);

                        context.Response.StatusCode = matchRule.StatusCode;
                        context.Response.Headers.Location = matchRule.TargetUrl;
                        return;
                    }
                }
            }

            await _next(context);
        }
    }
}