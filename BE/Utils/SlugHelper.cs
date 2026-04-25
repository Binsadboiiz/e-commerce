using System.Text.RegularExpressions;

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
    }
}