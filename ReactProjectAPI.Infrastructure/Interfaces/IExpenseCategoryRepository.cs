using ReactProjectAPI.Domain.Entities;

namespace ReactProjectAPI.Infrastructure.Interfaces
{
    public interface IExpenseCategoryRepository
    {
        Task<IEnumerable<ExpenseCategory>> GetAllAsync();
        Task<ExpenseCategory> GetByIdAsync(int id);
        Task<ExpenseCategory> CreateAsync(ExpenseCategory category);
        Task<ExpenseCategory> UpdateAsync(ExpenseCategory category);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<ExpenseCategory>> GetByStatusAsync(string status);
    }
}