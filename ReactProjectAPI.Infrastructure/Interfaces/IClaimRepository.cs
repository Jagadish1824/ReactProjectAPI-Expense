using ReactProjectAPI.Domain.Entities;

namespace ReactProjectAPI.Infrastructure.Interfaces
{
    public interface IClaimRepository
    {
        Task<IEnumerable<Claim>> GetAllAsync();
        Task<Claim> GetByIdAsync(int id);
        Task<Claim> CreateAsync(Claim claim);
        Task<Claim> UpdateAsync(Claim claim);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Claim>> GetByStatusAsync(string status);
        Task<IEnumerable<Claim>> GetPendingClaimsAsync();
        Task<IEnumerable<Claim>> GetApprovedClaimsAsync();
        Task<IEnumerable<Claim>> GetRejectedClaimsAsync();
        Task<IEnumerable<Claim>> GetClaimsByUserIdAsync(int userId);
    }
}