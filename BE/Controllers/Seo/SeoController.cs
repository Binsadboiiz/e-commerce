using System.Text;
using System.Xml.Linq;
using BE.Data;
using BE.Middlewares;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace BE.Controllers.Seo;

[ApiController]
public class SeoController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMemoryCache _cache;
    private readonly IConfiguration _configuration;

    public SeoController(ApplicationDbContext dbContext, IMemoryCache cache, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _cache = cache;
        _configuration = configuration;
    }

    /// <summary>
    /// Serves robots.txt for search engine crawlers
    /// Route: GET /robots.txt
    /// </summary>
    [HttpGet("robots.txt")]
    [Produces("text/plain")]
    public IActionResult GetRobotsTxt()
    {
        var domain = _configuration["SiteSettings:Domain"] ?? "https://polarisx.vn";

        var sb = new StringBuilder();
        sb.AppendLine("User-agent: *");
        sb.AppendLine("Allow: /");
        sb.AppendLine("Allow: /products");
        sb.AppendLine("Allow: /products/*");
        sb.AppendLine("Allow: /shops/*");
        sb.AppendLine();
        sb.AppendLine("Disallow: /api/");
        sb.AppendLine("Disallow: /cart");
        sb.AppendLine("Disallow: /checkout");
        sb.AppendLine("Disallow: /my-orders");
        sb.AppendLine("Disallow: /profile");
        sb.AppendLine("Disallow: /seller/");
        sb.AppendLine("Disallow: /admin/");
        sb.AppendLine();
        sb.AppendLine($"Sitemap: {domain}/sitemap.xml");

        return Content(sb.ToString(), "text/plain", Encoding.UTF8);
    }

    /// <summary>
    /// Serves dynamic XML sitemap for indexed pages, products, categories, and shops
    /// Route: GET /sitemap.xml
    /// </summary>
    [HttpGet("sitemap.xml")]
    [Produces("application/xml")]
    public async Task<IActionResult> GetSitemapXml()
    {
        var domain = (_configuration["SiteSettings:Domain"] ?? "https://polarisx.vn").TrimEnd('/');

        XNamespace ns = "http://www.sitemaps.org/schemas/sitemap/0.9";
        var urlset = new XElement(ns + "urlset");

        // 1. Static Core Pages
        AddSitemapUrl(urlset, ns, $"{domain}/", DateTime.UtcNow, "daily", "1.0");
        AddSitemapUrl(urlset, ns, $"{domain}/products", DateTime.UtcNow, "hourly", "0.9");
        AddSitemapUrl(urlset, ns, $"{domain}/seller/registration", DateTime.UtcNow, "monthly", "0.5");

        // 2. Dynamic Products
        var products = await _dbContext.Products
            .AsNoTracking()
            .Where(p => p.Status == "active")
            .Select(p => new { p.ProductId, p.Slug, p.UpdatedAt, p.CreatedAt })
            .Take(10000)
            .ToListAsync();

        foreach (var prod in products)
        {
            var productUrl = !string.IsNullOrWhiteSpace(prod.Slug)
                ? $"{domain}/products/{prod.Slug}"
                : $"{domain}/products/{prod.ProductId}";

            var lastMod = prod.UpdatedAt != default ? prod.UpdatedAt : prod.CreatedAt;
            AddSitemapUrl(urlset, ns, productUrl, lastMod, "daily", "0.8");
        }

        // 3. Dynamic Categories
        var categories = await _dbContext.Categories
            .AsNoTracking()
            .Select(c => new { c.CategoryId })
            .ToListAsync();

        foreach (var cat in categories)
        {
            AddSitemapUrl(urlset, ns, $"{domain}/products?categoryIds={cat.CategoryId}", DateTime.UtcNow, "weekly", "0.7");
        }

        // 4. Dynamic Shops
        var shops = await _dbContext.Shops
            .AsNoTracking()
            .Where(s => s.IsActive)
            .Select(s => new { s.ShopId, s.Update_At, s.Create_At })
            .ToListAsync();

        foreach (var shop in shops)
        {
            var lastMod = shop.Update_At != default ? shop.Update_At : shop.Create_At;
            AddSitemapUrl(urlset, ns, $"{domain}/shops/{shop.ShopId}", lastMod, "weekly", "0.7");
        }

        var doc = new XDocument(new XDeclaration("1.0", "utf-8", "yes"), urlset);
        return Content(doc.ToString(), "application/xml", Encoding.UTF8);
    }

    /// <summary>
    /// Endpoint to clear Prerender.io memory cache
    /// Route: POST /api/seo/clear-cache
    /// </summary>
    [HttpPost("api/seo/clear-cache")]
    public IActionResult ClearCache()
    {
        if (_cache is MemoryCache memoryCache)
        {
            memoryCache.Compact(1.0); // Evict 100% of entries
            return Ok(new { status = true, message = "Prerender memory cache cleared successfully." });
        }

        return Ok(new { status = false, message = "Cache provider does not support bulk compact." });
    }

    private static void AddSitemapUrl(XElement parent, XNamespace ns, string loc, DateTime lastmod, string changefreq, string priority)
    {
        parent.Add(new XElement(ns + "url",
            new XElement(ns + "loc", loc),
            new XElement(ns + "lastmod", lastmod.ToString("yyyy-MM-ddTHH:mm:ssK")),
            new XElement(ns + "changefreq", changefreq),
            new XElement(ns + "priority", priority)
        ));
    }
}
