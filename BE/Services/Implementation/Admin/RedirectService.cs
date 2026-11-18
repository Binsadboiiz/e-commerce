using BE.Data;
using BE.Models.Entities;
using BE.Services.Interface.Admin;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Text.RegularExpressions;

namespace BE.Services.Implementation.Admin
{
    public class RedirectService : IRedirectService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMemoryCache _cache;
        private readonly ILogger<RedirectService> _logger;
        private const string CacheKey = "active_redirect_rules_cache";
        private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(60);

        public RedirectService(
            ApplicationDbContext dbContext,
            IMemoryCache cache,
            ILogger<RedirectService> logger)
        {
            _dbContext = dbContext;
            _cache = cache;
            _logger = logger;
        }

        private async Task<List<RedirectRule>> GetActiveRulesFromCacheAsync()
        {
            if (!_cache.TryGetValue(CacheKey, out List<RedirectRule>? rules) || rules == null)
            {
                rules = await _dbContext.RedirectRules
                    .Where(r => r.IsActive)
                    .AsNoTracking()
                    .ToListAsync();

                _cache.Set(CacheKey, rules, CacheDuration);
            }
            return rules;
        }

        private void ClearCache()
        {
            _cache.Remove(CacheKey);
        }

        public async Task<RedirectRule?> GetMatchingRedirectAsync(string path)
        {
            if (string.IsNullOrWhiteSpace(path)) return null;

            var activeRules = await GetActiveRulesFromCacheAsync();

            // 1. Exact Match (Case insensitive)
            var exactMatch = activeRules.FirstOrDefault(r => 
                !r.IsRegex && r.SourceUrl.Equals(path, StringComparison.OrdinalIgnoreCase));

            if (exactMatch != null) return exactMatch;

            // 2. Regex Match
            foreach (var rule in activeRules.Where(r => r.IsRegex))
            {
                try
                {
                    if (Regex.IsMatch(path, rule.SourceUrl, RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(100)))
                    {
                        return rule;
                    }
                }
                catch (RegexMatchTimeoutException)
                {
                    _logger.LogWarning("[Redirect Engine] Regex timeout for pattern {Pattern} on path {Path}", rule.SourceUrl, path);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[Redirect Engine] Invalid Regex pattern {Pattern}", rule.SourceUrl);
                }
            }

            return null;
        }

        public async Task<List<RedirectRule>> GetAllRulesAsync()
        {
            return await _dbContext.RedirectRules
                .OrderByDescending(r => r.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<RedirectRule?> GetRuleByIdAsync(int id)
        {
            return await _dbContext.RedirectRules.FindAsync(id);
        }

        public async Task<RedirectRule> CreateRuleAsync(RedirectRule rule)
        {
            // Validate self-loop
            if (rule.SourceUrl.Trim().Equals(rule.TargetUrl.Trim(), StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Source URL and Target URL cannot be identical (Self-loop).");
            }

            // Validate duplicate source URL
            var exists = await _dbContext.RedirectRules.AnyAsync(r => r.SourceUrl.ToLower() == rule.SourceUrl.Trim().ToLower());
            if (exists)
            {
                throw new InvalidOperationException($"A redirect rule for source URL '{rule.SourceUrl}' already exists.");
            }

            // Normalize URLs
            rule.SourceUrl = rule.SourceUrl.Trim();
            rule.TargetUrl = rule.TargetUrl.Trim();
            rule.CreatedAt = DateTime.UtcNow;
            rule.UpdatedAt = DateTime.UtcNow;

            _dbContext.RedirectRules.Add(rule);
            await _dbContext.SaveChangesAsync();
            ClearCache();

            return rule;
        }

        public async Task<RedirectRule> UpdateRuleAsync(int id, RedirectRule updatedRule)
        {
            var existing = await _dbContext.RedirectRules.FindAsync(id);
            if (existing == null)
            {
                throw new KeyNotFoundException($"Redirect rule with ID {id} not found.");
            }

            if (updatedRule.SourceUrl.Trim().Equals(updatedRule.TargetUrl.Trim(), StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Source URL and Target URL cannot be identical.");
            }

            var duplicate = await _dbContext.RedirectRules.AnyAsync(r => r.Id != id && r.SourceUrl.ToLower() == updatedRule.SourceUrl.Trim().ToLower());
            if (duplicate)
            {
                throw new InvalidOperationException($"Another redirect rule already exists for source URL '{updatedRule.SourceUrl}'.");
            }

            existing.SourceUrl = updatedRule.SourceUrl.Trim();
            existing.TargetUrl = updatedRule.TargetUrl.Trim();
            existing.StatusCode = updatedRule.StatusCode;
            existing.IsRegex = updatedRule.IsRegex;
            existing.IsActive = updatedRule.IsActive;
            existing.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            ClearCache();

            return existing;
        }

        public async Task<bool> DeleteRuleAsync(int ruleId)
        {
            var rule = await _dbContext.RedirectRules.FindAsync(ruleId);
            if (rule == null) return false;

            _dbContext.RedirectRules.Remove(rule);
            await _dbContext.SaveChangesAsync();
            ClearCache();
            return true;
        }

        public async Task<bool> ToggleRuleStatusAsync(int ruleId)
        {
            var rule = await _dbContext.RedirectRules.FindAsync(ruleId);
            if (rule == null) return false;

            rule.IsActive = !rule.IsActive;
            rule.UpdatedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
            ClearCache();
            return rule.IsActive;
        }

        public async Task IncrementHitCountAsync(int ruleId)
        {
            try
            {
                await _dbContext.RedirectRules
                    .Where(r => r.Id == ruleId)
                    .ExecuteUpdateAsync(s => s
                        .SetProperty(r => r.HitCount, r => r.HitCount + 1)
                        .SetProperty(r => r.LastAccessedAt, DateTime.UtcNow));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating hit count for redirect rule {RuleId}", ruleId);
            }
        }
    }
}