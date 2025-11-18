using Microsoft.EntityFrameworkCore;
using ReactProjectAPI.Domain.Entities;
using ReactProjectAPI.Infrastructure.Data;
using ReactProjectAPI.Infrastructure.Interfaces;

namespace ReactProjectAPI.Infrastructure.Repositories
{
    public class ExpenseCategoryRepository : IExpenseCategoryRepository
    {
        private readonly ReactProjectAPIContext _context;

        public ExpenseCategoryRepository(ReactProjectAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ExpenseCategory>> GetAllAsync()
        {
            return await _context.ExpenseCategories.ToListAsync();
        }

        public async Task<ExpenseCategory> GetByIdAsync(int id)
        {
            return await _context.ExpenseCategories.FirstOrDefaultAsync(c => c.CategoryId == id);
        }

        public async Task<ExpenseCategory> CreateAsync(ExpenseCategory category)
        {
            _context.ExpenseCategories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<ExpenseCategory> UpdateAsync(ExpenseCategory category)
        {
            _context.ExpenseCategories.Update(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await GetByIdAsync(id);
            if (category == null) return false;

            _context.ExpenseCategories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ExpenseCategory>> GetByStatusAsync(string status)
        {
            return await _context.ExpenseCategories.Where(c => c.CategoryName.Contains(status)).ToListAsync();
        }
    }
}