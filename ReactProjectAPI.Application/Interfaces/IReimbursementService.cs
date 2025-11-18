using ReactProjectAPI.Application.DTOs;

namespace ReactProjectAPI.Application.Interfaces
{
    public interface IReimbursementService
    {
        Task<IEnumerable<ReimbursementDto>> GetAllAsync();
        Task<ReimbursementDto> GetByIdAsync(int id);
        Task<ReimbursementDto> CreateAsync(CreateReimbursementDto createDto);
        Task<ReimbursementDto> UpdateAsync(int id, UpdateReimbursementDto updateDto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<ReimbursementDto>> GetByStatusAsync(string status);
    }
}