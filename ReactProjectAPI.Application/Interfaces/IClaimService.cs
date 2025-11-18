using ReactProjectAPI.Application.DTOs;

namespace ReactProjectAPI.Application.Interfaces
{
    public interface IClaimService
    {
        Task<IEnumerable<ClaimDto>> GetAllAsync();
        Task<ClaimDto> GetByIdAsync(int id);
        Task<ClaimDto> CreateAsync(CreateClaimDto createDto);
        Task<ClaimDto> CreateAsync(CreateClaimDto createDto, int userId);
        Task<IEnumerable<ClaimDto>> GetClaimsByUserIdAsync(int userId);
        Task<ClaimDto> UpdateAsync(int id, UpdateClaimDto updateDto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<ClaimDto>> GetByStatusAsync(string status);
        Task<IEnumerable<ClaimDto>> GetPendingClaimsAsync();
        Task<IEnumerable<ClaimDto>> GetApprovedClaimsAsync();
        Task<IEnumerable<ClaimDto>> GetRejectedClaimsAsync();
    }
}