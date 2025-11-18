using ReactProjectAPI.Application.DTOs;

namespace ReactProjectAPI.Application.Interfaces
{
    public interface IApprovalService
    {
        Task<IEnumerable<ApprovalDto>> GetAllAsync();
        Task<ApprovalDto> GetByIdAsync(int id);
        Task<ApprovalDto> CreateAsync(CreateApprovalDto createDto);
        Task<ApprovalDto> CreateAsync(CreateApprovalDto createDto, int managerId);
        Task<ApprovalDto> UpdateAsync(int id, UpdateApprovalDto updateDto);
        Task<bool> DeleteAsync(int id);
    }
}