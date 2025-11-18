namespace ReactProjectAPI.Application.DTOs
{
    public class DashboardAnalyticsDto
    {
        public int TotalClaims { get; set; }
        public int PendingClaims { get; set; }
        public int ApprovedClaims { get; set; }
        public int RejectedClaims { get; set; }
        public int PaidClaims { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal PendingAmount { get; set; }
        public List<CategoryAnalyticsDto> CategoryBreakdown { get; set; }
        public List<MonthlyAnalyticsDto> MonthlyTrends { get; set; }
    }

    public class CategoryAnalyticsDto
    {
        public string CategoryName { get; set; }
        public int ClaimCount { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class MonthlyAnalyticsDto
    {
        public string Month { get; set; }
        public int ClaimCount { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class UserAnalyticsDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int TotalClaims { get; set; }
        public decimal TotalAmount { get; set; }
        public int ApprovedClaims { get; set; }
        public int RejectedClaims { get; set; }
    }
}