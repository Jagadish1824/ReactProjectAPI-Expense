using ReactProjectAPI.Domain.Entities;

namespace ReactProjectAPI.Infrastructure.Interfaces
{
    public interface IApprovalRepository
    {
        Task<IEnumerable<Approval>> GetAllAsync();
        Task<Approval> GetByIdAsync(int id);
        Task<Approval> CreateAsync(Approval approval);
        Task<Approval> UpdateAsync(Approval approval);
        Task<bool> DeleteAsync(int id);
    }
}