using System.Net;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace BE.Middlewares;

/// <summary>
/// Configuration settings for Prerender.io Dynamic Rendering
/// </summary>
public class PrerenderOptions
{
    public const string SectionName = "Prerender";

    public bool Enabled { get; set; } = true;
    public string PrerenderToken { get; set; } = string.Empty;
    public string PrerenderServiceUrl { get; set; } = "https://service.prerender.io/";
    public int CacheDurationMinutes { get; set; } = 1440; // 24 hours

    public List<string> CrawlerUserAgents { get; set; } = new()
    {
        "googlebot",
        "bingbot",
        "yandex",
        "baiduspider",
        "facebookexternalhit",
        "twitterbot",
        "rogerbot",
        "linkedinbot",
        "embedly",
        "quora link preview",
        "showyouhoping",
        "outbrain",
        "pinterest",
        "slackbot",
        "vkshare",
        "w3c_validator",
        "whatsapp",
        "telegrambot",
        "discordbot",
        "duckduckbot",
        "applebot",
        "skypeuripreview"
    };

    public List<string> IgnoredExtensions { get; set; } = new()
    {
        ".js", ".css", ".xml", ".less", ".png", ".jpg", ".jpeg", ".gif", ".pdf",
        ".doc", ".txt", ".ico", ".rss", ".zip", ".mp3", ".rar", ".exe", ".wmv",
        ".avi", ".ppt", ".mpg", ".mpeg", ".tif", ".wav", ".mov", ".psd", ".ai",
        ".xls", ".mp4", ".m4a", ".swf", ".dat", ".dmg", ".iso", ".flv", ".m4v",
        ".torrent", ".woff", ".woff2", ".ttf", ".svg", ".webmanifest", ".json"
    };

    public List<string> IgnoredRoutes { get; set; } = new()
    {
        "/api/",
        "/swagger",
        "/admin",
        "/seller",
        "/cart",
        "/checkout",
        "/my-orders",
        "/profile"
    };
}

/// <summary>
/// Middleware to detect search engine bots & social media crawlers and route requests
/// to Prerender.io dynamic rendering service while serving cached HTML snapshots.
/// </summary>
public class PrerenderMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMemoryCache _cache;
    private readonly ILogger<PrerenderMiddleware> _logger;
    private readonly PrerenderOptions _options;

    public PrerenderMiddleware(
        RequestDelegate next,
        IHttpClientFactory httpClientFactory,
        IMemoryCache cache,
        ILogger<PrerenderMiddleware> logger,
        IOptions<PrerenderOptions> options)
    {
        _next = next;
        _httpClientFactory = httpClientFactory;
        _cache = cache;
        _logger = logger;
        _options = options.Value;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!_options.Enabled || !ShouldPrerender(context.Request))
        {
            await _next(context);
            return;
        }

        var requestUrl = GetFullRequestUrl(context.Request);
        var cacheKey = $"prerender_cache:{requestUrl}";

        // 1. Check Prerender HTML Cache
        if (_cache.TryGetValue(cacheKey, out CachedPrerenderResponse? cachedResponse) && cachedResponse != null)
        {
            _logger.LogInformation("[Prerender Cache HIT] Serving cached page for {Url}", requestUrl);
            context.Response.Headers["X-Prerender-Cache"] = "HIT";
            context.Response.StatusCode = cachedResponse.StatusCode;
            context.Response.ContentType = cachedResponse.ContentType;

            foreach (var header in cachedResponse.Headers)
            {
                context.Response.Headers[header.Key] = header.Value;
            }

            await context.Response.WriteAsync(cachedResponse.HtmlBody);
            return;
        }

        // 2. Cache MISS: Forward Request to Prerender.io
        _logger.LogInformation("[Prerender Cache MISS] Proxying bot request to Prerender.io for {Url}", requestUrl);
        try
        {
            using var client = _httpClientFactory.CreateClient("PrerenderClient");
            var prerenderTargetUrl = $"{_options.PrerenderServiceUrl.TrimEnd('/')}/{requestUrl}";

            using var prerenderRequest = new HttpRequestMessage(HttpMethod.Get, prerenderTargetUrl);

            // Forward Token and original headers
            if (!string.IsNullOrWhiteSpace(_options.PrerenderToken))
            {
                prerenderRequest.Headers.TryAddWithoutValidation("X-Prerender-Token", _options.PrerenderToken);
            }

            var userAgent = context.Request.Headers.UserAgent.ToString();
            if (!string.IsNullOrEmpty(userAgent))
            {
                prerenderRequest.Headers.TryAddWithoutValidation("User-Agent", userAgent);
            }

            var clientIp = context.Connection.RemoteIpAddress?.ToString();
            if (!string.IsNullOrEmpty(clientIp))
            {
                prerenderRequest.Headers.TryAddWithoutValidation("X-Forwarded-For", clientIp);
            }

            prerenderRequest.Headers.TryAddWithoutValidation("X-Forwarded-Proto", context.Request.Scheme);

            using var prerenderResponse = await client.SendAsync(prerenderRequest, HttpCompletionOption.ResponseHeadersRead);

            context.Response.StatusCode = (int)prerenderResponse.StatusCode;
            context.Response.Headers["X-Prerender-Cache"] = "MISS";

            // Copy relevant response headers
            var headerMap = new Dictionary<string, string>();
            foreach (var header in prerenderResponse.Headers)
            {
                if (!header.Key.Equals("Transfer-Encoding", StringComparison.OrdinalIgnoreCase))
                {
                    context.Response.Headers[header.Key] = header.Value.ToArray();
                    headerMap[header.Key] = string.Join(",", header.Value);
                }
            }
            foreach (var header in prerenderResponse.Content.Headers)
            {
                if (!header.Key.Equals("Content-Length", StringComparison.OrdinalIgnoreCase))
                {
                    context.Response.Headers[header.Key] = header.Value.ToArray();
                    headerMap[header.Key] = string.Join(",", header.Value);
                }
            }

            var htmlContent = await prerenderResponse.Content.ReadAsStringAsync();

            // Cache successful HTML response (200 OK)
            if (prerenderResponse.StatusCode == HttpStatusCode.OK && _options.CacheDurationMinutes > 0)
            {
                var cachedData = new CachedPrerenderResponse
                {
                    StatusCode = (int)prerenderResponse.StatusCode,
                    ContentType = prerenderResponse.Content.Headers.ContentType?.ToString() ?? "text/html; charset=utf-8",
                    HtmlBody = htmlContent,
                    Headers = headerMap
                };

                _cache.Set(cacheKey, cachedData, TimeSpan.FromMinutes(_options.CacheDurationMinutes));
            }

            await context.Response.WriteAsync(htmlContent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[Prerender Error] Failed to render URL {Url}. Falling back to default app execution.", requestUrl);
            await _next(context);
        }
    }

    private bool ShouldPrerender(HttpRequest request)
    {
        // Only GET / HEAD requests are prerendered
        if (request.Method != HttpMethods.Get && request.Method != HttpMethods.Head)
            return false;

        // Forced testing flag
        if (request.Query.ContainsKey("_escaped_fragment_") || request.Query.ContainsKey("prerender"))
            return true;

        var path = request.Path.Value ?? string.Empty;

        // Exclude ignored route prefixes
        if (_options.IgnoredRoutes.Any(ignored => path.StartsWith(ignored, StringComparison.OrdinalIgnoreCase)))
            return false;

        // Exclude ignored static asset extensions
        if (_options.IgnoredExtensions.Any(ext => path.EndsWith(ext, StringComparison.OrdinalIgnoreCase)))
            return false;

        // Check bot User-Agent
        var userAgent = request.Headers.UserAgent.ToString().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(userAgent))
            return false;

        return _options.CrawlerUserAgents.Any(botAgent => userAgent.Contains(botAgent.ToLowerInvariant()));
    }

    private static string GetFullRequestUrl(HttpRequest request)
    {
        return $"{request.Scheme}://{request.Host}{request.Path}{request.QueryString}";
    }
}

public class CachedPrerenderResponse
{
    public int StatusCode { get; set; }
    public string ContentType { get; set; } = "text/html; charset=utf-8";
    public string HtmlBody { get; set; } = string.Empty;
    public Dictionary<string, string> Headers { get; set; } = new();
}
