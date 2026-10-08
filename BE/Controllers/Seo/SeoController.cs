using System.Globalization;
using System.Text;
using System.Xml;
using System.Xml.Linq;
using BE.Constants;
using BE.Data;
using BE.Middlewares;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace BE.Controllers.Seo
{

[ApiController]
public class SeoController : ControllerBase
{
    private const string DefaultDomain = "https://polarisx.vn";
    private const int MaxProductUrls = 10_000;
    private static readonly XNamespace SitemapNamespace = "http://www.sitemaps.org/schemas/sitemap/0.9";

    private readonly ApplicationDbContext _dbContext;
    private readonly IMemoryCache _cache;
    private readonly IConfiguration _configuration;
    private readonly ILogger<SeoController> _logger;

    public SeoController(
        ApplicationDbContext dbContext,
        IMemoryCache cache,
        IConfiguration configuration,
        ILogger<SeoController> logger)
    {
        _dbContext = dbContext;
        _cache = cache;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>Serves robots.txt for search engine crawlers.</summary>
    [HttpGet("robots.txt")]
    [Produces("text/plain")]
    public IActionResult GetRobotsTxt()
    {
        var domain = GetCanonicalDomain();
        var robots = new StringBuilder()
            .AppendLine("User-agent: *")
            .AppendLine("Allow: /")
            .AppendLine("Allow: /products")
            .AppendLine("Allow: /products/*")
            .AppendLine()
            .AppendLine("Disallow: /api/")
            .AppendLine("Disallow: /cart")
            .AppendLine("Disallow: /checkout")
            .AppendLine("Disallow: /my-orders")
            .AppendLine("Disallow: /profile")
            .AppendLine("Allow: /seller/registration")
            .AppendLine("Disallow: /seller/")
            .AppendLine("Disallow: /admin/")
            .AppendLine()
            .AppendLine($"Sitemap: {domain}/sitemap.xml")
            .ToString();

        return Content(robots, "text/plain", Encoding.UTF8);
    }

    /// <summary>Serves the dynamic sitemap for public, indexable routes.</summary>
    [HttpGet("sitemap.xml")]
    [Produces("application/xml")]
    public async Task<IActionResult> GetSitemapXml()
    {
        var domain = GetCanonicalDomain();
        var urls = new XElement(SitemapNamespace + "urlset");
        var knownLocations = new HashSet<string>(StringComparer.Ordinal);

        AddSitemapUrl(urls, knownLocations, domain + "/", null, "daily", "1.0");
        AddSitemapUrl(urls, knownLocations, domain + "/products", null, "hourly", "0.9");
        AddSitemapUrl(urls, knownLocations, domain + "/seller/registration", null, "monthly", "0.5");

        await AddProductUrlsAsync(urls, knownLocations, domain);
        await AddCategoryUrlsAsync(urls, knownLocations, domain);

        var document = new XDocument(new XDeclaration("1.0", "utf-8", null), urls);
        return Content(document.ToString(), "application/xml", Encoding.UTF8);
    }

    private async Task AddProductUrlsAsync(XElement urlset, ISet<string> knownLocations, string domain)
    {
        // Log malformed ACTIVE rows by id, then query only products that can form a detail URL.
        var productsMissingSlug = await _dbContext.Products
            .AsNoTracking()
            .Where(product => product.Status == ProductConstants.ProductStatusActive
                && (product.Slug == null || product.Slug == ""))
            .Select(product => product.ProductId)
            .ToListAsync();

        foreach (var productId in productsMissingSlug)
        {
            _logger.LogWarning(
                "Skipping ACTIVE product {ProductId} from sitemap because its slug is missing.",
                productId);
        }

        // The existing implementation caps product URLs at 10,000; this does not cover larger catalogs.
        var productRows = await _dbContext.Products
            .AsNoTracking()
            .Where(product => product.Status == ProductConstants.ProductStatusActive
                && product.Slug != null
                && product.Slug != "")
            .OrderBy(product => product.ProductId)
            .Select(product => new
            {
                product.ProductId,
                product.Slug,
                product.UpdatedAt,
                product.CreatedAt
            })
            .Take(MaxProductUrls + 1)
            .ToListAsync();

        if (productRows.Count > MaxProductUrls)
        {
            _logger.LogWarning(
                "Sitemap product URL limit of {MaxProductUrls} reached; products beyond the limit are omitted.",
                MaxProductUrls);
        }

        foreach (var product in productRows.Take(MaxProductUrls))
        {
            if (string.IsNullOrWhiteSpace(product.Slug))
            {
                _logger.LogWarning(
                    "Skipping ACTIVE product {ProductId} from sitemap because its slug is blank.",
                    product.ProductId);
                continue;
            }

            var location = $"{domain}/products/{Uri.EscapeDataString(product.Slug)}";
            AddSitemapUrl(
                urlset,
                knownLocations,
                location,
                GetLastModified(product.UpdatedAt, product.CreatedAt),
                "daily",
                "0.8");
        }
    }

    private async Task AddCategoryUrlsAsync(XElement urlset, ISet<string> knownLocations, string domain)
    {
        // ProductList is a public route and currently consumes categoryIds as a filter query parameter.
        var categoryIds = await _dbContext.Categories
            .AsNoTracking()
            .Select(category => category.CategoryId)
            .ToListAsync();

        foreach (var categoryId in categoryIds)
        {
            AddSitemapUrl(
                urlset,
                knownLocations,
                $"{domain}/products?categoryIds={categoryId.ToString(CultureInfo.InvariantCulture)}",
                null,
                "weekly",
                "0.6");
        }
    }

    /// <summary>
    /// Clears the shared in-memory cache. Restricted to administrators because this affects
    /// application-wide cache entries, not only SEO data.
    /// </summary>
    [Authorize(Roles = RoleConstants.Admin)]
    [HttpPost("api/seo/clear-cache")]
    public IActionResult ClearCache()
    {
        if (_cache is not MemoryCache memoryCache)
        {
            return StatusCode(StatusCodes.Status501NotImplemented,
                new { status = false, message = "Cache provider does not support bulk compact." });
        }

        memoryCache.Compact(1.0);
        return Ok(new { status = true, message = "Application memory cache cleared successfully." });
    }

    private string GetCanonicalDomain()
    {
        var configuredDomain = _configuration["SiteSettings:Domain"];
        return (string.IsNullOrWhiteSpace(configuredDomain) ? DefaultDomain : configuredDomain).TrimEnd('/');
    }

    private static DateTime? GetLastModified(DateTime updatedAt, DateTime createdAt)
    {
        if (updatedAt != default)
        {
            return updatedAt;
        }

        return createdAt != default ? createdAt : null;
    }

    private static void AddSitemapUrl(
        XElement parent,
        ISet<string> knownLocations,
        string location,
        DateTime? lastModified,
        string changeFrequency,
        string priority)
    {
        if (string.IsNullOrWhiteSpace(location) || !knownLocations.Add(location))
        {
            return;
        }

        var url = new XElement(SitemapNamespace + "url",
            new XElement(SitemapNamespace + "loc", location),
            new XElement(SitemapNamespace + "changefreq", changeFrequency),
            new XElement(SitemapNamespace + "priority", priority));

        if (lastModified.HasValue)
        {
            url.Add(new XElement(
                SitemapNamespace + "lastmod",
                XmlConvert.ToString(lastModified.Value, XmlDateTimeSerializationMode.RoundtripKind)));
        }

        parent.Add(url);
    }
}
}