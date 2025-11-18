using ReactProjectAPI.Application.DTOs;

namespace ReactProjectAPI.Application.Interfaces
{
    public interface IAnalyticsService
    {
        Task<DashboardAnalyticsDto> GetDashboardAnalyticsAsync();
        Task<DashboardAnalyticsDto> GetUserAnalyticsAsync(int userId);
        Task<List<UserAnalyticsDto>> GetTopUsersAnalyticsAsync();
    }
}