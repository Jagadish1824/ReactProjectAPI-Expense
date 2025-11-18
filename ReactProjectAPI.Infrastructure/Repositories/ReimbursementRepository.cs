using Microsoft.EntityFrameworkCore;
using ReactProjectAPI.Domain.Entities;
using ReactProjectAPI.Infrastructure.Data;
using ReactProjectAPI.Infrastructure.Interfaces;

namespace ReactProjectAPI.Infrastructure.Repositories
{
    public class ReimbursementRepository : IReimbursementRepository
    {
        private readonly ReactProjectAPIContext _context;

        public ReimbursementRepository(ReactProjectAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Reimbursement>> GetAllAsync()
        {
            return await _context.Reimbursements
                .Include(r => r.Claim)
                .Include(r => r.ProcessedByUser)
                .ToListAsync();
        }

        public async Task<Reimbursement> GetByIdAsync(int id)
        {
            return await _context.Reimbursements
                .Include(r => r.Claim)
                .Include(r => r.ProcessedByUser)
                .FirstOrDefaultAsync(r => r.ReimbursementId == id);
        }

        public async Task<Reimbursement> CreateAsync(Reimbursement reimbursement)
        {
            _context.Reimbursements.Add(reimbursement);
            await _context.SaveChangesAsync();
            return reimbursement;
        }

        public async Task<Reimbursement> UpdateAsync(Reimbursement reimbursement)
        {
            _context.Reimbursements.Update(reimbursement);
            await _context.SaveChangesAsync();
            return reimbursement;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var reimbursement = await GetByIdAsync(id);
            if (reimbursement == null) return false;

            _context.Reimbursements.Remove(reimbursement);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Reimbursement>> GetByStatusAsync(string status)
        {
            return await _context.Reimbursements
                .Include(r => r.Claim)
                .Include(r => r.ProcessedByUser)
                .Where(r => r.Status == status)
                .ToListAsync();
        }
    }
}