using ReactProjectAPI.Domain.Entities;

namespace ReactProjectAPI.Infrastructure.Interfaces
{
    public interface IReimbursementRepository
    {
        Task<IEnumerable<Reimbursement>> GetAllAsync();
        Task<Reimbursement> GetByIdAsync(int id);
        Task<Reimbursement> CreateAsync(Reimbursement reimbursement);
        Task<Reimbursement> UpdateAsync(Reimbursement reimbursement);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Reimbursement>> GetByStatusAsync(string status);
    }
}