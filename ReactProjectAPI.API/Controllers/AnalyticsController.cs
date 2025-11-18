using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Interfaces;
using System.Security.Claims;

namespace ReactProjectAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;
        private readonly IMapper _mapper;
        private readonly ILogger<AnalyticsController> _logger;

        public AnalyticsController(IAnalyticsService analyticsService, IMapper mapper, ILogger<AnalyticsController> logger)
        {
            _analyticsService = analyticsService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet("dashboard")]
        [Authorize(Roles = "Manager,Finance")]
        public async Task<ActionResult<DashboardAnalyticsDto>> GetDashboardAnalytics()
        {
            try
            {
                _logger.LogInformation("Retrieving dashboard analytics");
                var analytics = await _analyticsService.GetDashboardAnalyticsAsync();
                _logger.LogInformation("Dashboard analytics retrieved successfully");
                return Ok(analytics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while getting dashboard analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("user")]
        [Authorize(Roles = "Employee,Manager,Finance")]
        public async Task<ActionResult<DashboardAnalyticsDto>> GetUserAnalytics()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userIdClaim = User.FindFirst("userId")?.Value;
                
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    _logger.LogWarning("Invalid or missing userId claim in token");
                    return BadRequest("Invalid user token");
                }

                _logger.LogInformation("Retrieving user analytics for user: {UserId}", userId);
                var analytics = await _analyticsService.GetUserAnalyticsAsync(userId);
                _logger.LogInformation("User analytics retrieved successfully for user: {UserId}", userId);
                return Ok(analytics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while getting user analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("top-users")]
        [Authorize(Roles = "Manager,Finance")]
        public async Task<ActionResult<List<UserAnalyticsDto>>> GetTopUsersAnalytics()
        {
            try
            {
                _logger.LogInformation("Retrieving top users analytics");
                var analytics = await _analyticsService.GetTopUsersAnalyticsAsync();
                _logger.LogInformation("Top users analytics retrieved successfully");
                return Ok(analytics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while getting top users analytics");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}