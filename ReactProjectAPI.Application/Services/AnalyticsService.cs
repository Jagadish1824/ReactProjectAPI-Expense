using Microsoft.Extensions.Logging;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Interfaces;
using ReactProjectAPI.Infrastructure.Interfaces;

namespace ReactProjectAPI.Application.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IClaimRepository _claimRepository;
        private readonly ILogger<AnalyticsService> _logger;

        public AnalyticsService(IClaimRepository claimRepository, ILogger<AnalyticsService> logger)
        {
            _claimRepository = claimRepository;
            _logger = logger;
        }

        public async Task<DashboardAnalyticsDto> GetDashboardAnalyticsAsync()
        {
            _logger.LogInformation("AnalyticsService GetDashboardAnalyticsAsync started");
            _logger.LogInformation("Calling repository GetAllAsync");
            var claims = await _claimRepository.GetAllAsync();
            _logger.LogInformation("Repository call completed");

            _logger.LogInformation("Processing analytics data");
            var analytics = new DashboardAnalyticsDto
            {
                TotalClaims = claims.Count(),
                PendingClaims = claims.Count(c => c.Status == "Submitted" || c.Status == "Pending"),
                ApprovedClaims = claims.Count(c => c.Status == "Approved"),
                RejectedClaims = claims.Count(c => c.Status == "Rejected"),
                PaidClaims = claims.Count(c => c.Status == "Paid"),
                TotalAmount = claims.Sum(c => c.Amount),
                PaidAmount = claims.Where(c => c.Status == "Paid").Sum(c => c.Amount),
                PendingAmount = claims.Where(c => c.Status == "Submitted" || c.Status == "Pending").Sum(c => c.Amount),
                CategoryBreakdown = claims.GroupBy(c => c.Category.CategoryName)
                    .Select(g => new CategoryAnalyticsDto
                    {
                        CategoryName = g.Key,
                        ClaimCount = g.Count(),
                        TotalAmount = g.Sum(c => c.Amount)
                    }).ToList(),
                MonthlyTrends = claims.GroupBy(c => c.SubmittedDate.ToString("yyyy-MM"))
                    .Select(g => new MonthlyAnalyticsDto
                    {
                        Month = g.Key,
                        ClaimCount = g.Count(),
                        TotalAmount = g.Sum(c => c.Amount)
                    }).OrderBy(m => m.Month).ToList()
            };

            _logger.LogInformation("Analytics processing completed");
            _logger.LogInformation("AnalyticsService GetDashboardAnalyticsAsync completed");
            return analytics;
        }

        public async Task<DashboardAnalyticsDto> GetUserAnalyticsAsync(int userId)
        {
            _logger.LogInformation("AnalyticsService GetUserAnalyticsAsync started for user: {UserId}", userId);
            _logger.LogInformation("Calling repository GetClaimsByUserIdAsync");
            var claims = await _claimRepository.GetClaimsByUserIdAsync(userId);
            _logger.LogInformation("Repository call completed");

            _logger.LogInformation("Processing user analytics data");
            var analytics = new DashboardAnalyticsDto
            {
                TotalClaims = claims.Count(),
                PendingClaims = claims.Count(c => c.Status == "Submitted" || c.Status == "Pending"),
                ApprovedClaims = claims.Count(c => c.Status == "Approved"),
                RejectedClaims = claims.Count(c => c.Status == "Rejected"),
                PaidClaims = claims.Count(c => c.Status == "Paid"),
                TotalAmount = claims.Sum(c => c.Amount),
                PaidAmount = claims.Where(c => c.Status == "Paid").Sum(c => c.Amount),
                PendingAmount = claims.Where(c => c.Status == "Submitted" || c.Status == "Pending").Sum(c => c.Amount),
                CategoryBreakdown = claims.GroupBy(c => c.Category.CategoryName)
                    .Select(g => new CategoryAnalyticsDto
                    {
                        CategoryName = g.Key,
                        ClaimCount = g.Count(),
                        TotalAmount = g.Sum(c => c.Amount)
                    }).ToList(),
                MonthlyTrends = claims.GroupBy(c => c.SubmittedDate.ToString("yyyy-MM"))
                    .Select(g => new MonthlyAnalyticsDto
                    {
                        Month = g.Key,
                        ClaimCount = g.Count(),
                        TotalAmount = g.Sum(c => c.Amount)
                    }).OrderBy(m => m.Month).ToList()
            };

            _logger.LogInformation("User analytics processing completed");
            _logger.LogInformation("AnalyticsService GetUserAnalyticsAsync completed");
            return analytics;
        }

        public async Task<List<UserAnalyticsDto>> GetTopUsersAnalyticsAsync()
        {
            _logger.LogInformation("AnalyticsService GetTopUsersAnalyticsAsync started");
            _logger.LogInformation("Calling repository GetAllAsync");
            var claims = await _claimRepository.GetAllAsync();
            _logger.LogInformation("Repository call completed");

            _logger.LogInformation("Processing top users analytics");
            var userAnalytics = claims.GroupBy(c => new { c.UserId, c.User.Name })
                .Select(g => new UserAnalyticsDto
                {
                    UserId = g.Key.UserId,
                    UserName = g.Key.Name,
                    TotalClaims = g.Count(),
                    TotalAmount = g.Sum(c => c.Amount),
                    ApprovedClaims = g.Count(c => c.Status == "Approved"),
                    RejectedClaims = g.Count(c => c.Status == "Rejected")
                })
                .OrderByDescending(u => u.TotalAmount)
                .Take(10)
                .ToList();

            _logger.LogInformation("Top users analytics processing completed");
            _logger.LogInformation("AnalyticsService GetTopUsersAnalyticsAsync completed");
            return userAnalytics;
        }
    }
}