using System.Text.RegularExpressions;
using BE.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace BE.Utils
{
    public static class SlugHelper
    {
        public static string GenerateSlug(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return string.Empty;

            var slug = name.ToLower().Trim();

            // replace space 
            slug = Regex.Replace(slug, @"\s+", "-");

            // remove invalid chars
            slug = Regex.Replace(slug, @"[^a-z0-9\-]", "");

            // remove multiple dashes
            slug = Regex.Replace(slug, @"\-{2,}", "-");

            return slug.Trim('-');
        }

        public static async Task<string> GenerateUniqueSlugAsync(IQueryable<Product> query, string baseName)
        {
            var baseSlug = GenerateSlug(baseName);
            if (string.IsNullOrWhiteSpace(baseSlug))
            {
                baseSlug = "product";
            }

            var slug = baseSlug;
            var index = 1;

            while (await query.AnyAsync(p => p.Slug == slug))
            {
                slug = $"{baseSlug}-{index}";
                index++;
            }

            return slug;
        }
    }
}