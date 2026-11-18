using BE.Models.Entities;

namespace BE.Services.Interface.Admin
{
    public interface IRedirectService
    {
        Task<RedirectRule?> GetMatchingRedirectAsync(string path);
        Task<List<RedirectRule>> GetAllRulesAsync();
        Task<RedirectRule?> GetRuleByIdAsync(int id);
        Task<RedirectRule> CreateRuleAsync(RedirectRule rule);
        Task<RedirectRule> UpdateRuleAsync(int id, RedirectRule rule);
        Task<bool> DeleteRuleAsync(int ruleId);
        Task<bool> ToggleRuleStatusAsync(int ruleId);
        Task IncrementHitCountAsync(int ruleId);
    }
}