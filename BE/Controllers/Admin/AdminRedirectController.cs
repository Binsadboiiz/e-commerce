using BE.Constants;
using BE.Models.DTOs.Admin;
using BE.Models.Entities;
using BE.Services.Interface.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BE.Controllers.Admin
{
    [ApiController]
    [Authorize(Roles = RoleConstants.Admin)]
    [EnableRateLimiting("GeneralPolicy")]
    [Route("api/admin/redirects")]
    public class AdminRedirectController : ControllerBase
    {
        private readonly IRedirectService _redirectService;
        private readonly ILogger<AdminRedirectController> _logger;

        public AdminRedirectController(IRedirectService redirectService, ILogger<AdminRedirectController> logger)
        {
            _redirectService = redirectService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRules()
        {
            var rules = await _redirectService.GetAllRulesAsync();
            var dtos = rules.Select(MapToDto).ToList();
            return Ok(dtos);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetRuleById(int id)
        {
            var rule = await _redirectService.GetRuleByIdAsync(id);
            if (rule == null) return NotFound(new { message = $"Redirect rule with ID {id} not found." });
            return Ok(MapToDto(rule));
        }

        [HttpPost]
        public async Task<IActionResult> CreateRule([FromBody] CreateRedirectRuleDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var rule = new RedirectRule
                {
                    SourceUrl = dto.SourceUrl,
                    TargetUrl = dto.TargetUrl,
                    StatusCode = dto.StatusCode,
                    IsRegex = dto.IsRegex,
                    IsActive = dto.IsActive
                };

                var created = await _redirectService.CreateRuleAsync(rule);
                return CreatedAtAction(nameof(GetRuleById), new { id = created.Id }, MapToDto(created));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating redirect rule.");
                return StatusCode(500, new { message = "An internal server error occurred." });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateRule(int id, [FromBody] UpdateRedirectRuleDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var rule = new RedirectRule
                {
                    SourceUrl = dto.SourceUrl,
                    TargetUrl = dto.TargetUrl,
                    StatusCode = dto.StatusCode,
                    IsRegex = dto.IsRegex,
                    IsActive = dto.IsActive
                };

                var updated = await _redirectService.UpdateRuleAsync(id, rule);
                return Ok(MapToDto(updated));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating redirect rule {Id}", id);
                return StatusCode(500, new { message = "An internal server error occurred." });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteRule(int id)
        {
            var success = await _redirectService.DeleteRuleAsync(id);
            if (!success) return NotFound(new { message = $"Redirect rule with ID {id} not found." });
            return Ok(new { message = "Redirect rule deleted successfully." });
        }

        [HttpPatch("{id:int}/toggle")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var newStatus = await _redirectService.ToggleRuleStatusAsync(id);
            return Ok(new { id, isActive = newStatus });
        }

        private static RedirectRuleResponseDto MapToDto(RedirectRule rule)
        {
            return new RedirectRuleResponseDto
            {
                Id = rule.Id,
                SourceUrl = rule.SourceUrl,
                TargetUrl = rule.TargetUrl,
                StatusCode = rule.StatusCode,
                IsRegex = rule.IsRegex,
                IsActive = rule.IsActive,
                HitCount = rule.HitCount,
                LastAccessedAt = rule.LastAccessedAt,
                CreatedAt = rule.CreatedAt,
                UpdatedAt = rule.UpdatedAt
            };
        }
    }
}
