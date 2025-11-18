using Microsoft.EntityFrameworkCore;
using ReactProjectAPI.Domain.Entities;
using ReactProjectAPI.Infrastructure.Data;
using ReactProjectAPI.Infrastructure.Interfaces;

namespace ReactProjectAPI.Infrastructure.Repositories
{
    public class ApprovalRepository : IApprovalRepository
    {
        private readonly ReactProjectAPIContext _context;

        public ApprovalRepository(ReactProjectAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Approval>> GetAllAsync()
        {
            return await _context.Approvals
                .Include(a => a.Claim)
                .Include(a => a.ApprovedByUser)
                .ToListAsync();
        }

        public async Task<Approval> GetByIdAsync(int id)
        {
            return await _context.Approvals
                .Include(a => a.Claim)
                .Include(a => a.ApprovedByUser)
                .FirstOrDefaultAsync(a => a.ApprovalId == id);
        }

        public async Task<Approval> CreateAsync(Approval approval)
        {
            _context.Approvals.Add(approval);
            await _context.SaveChangesAsync();
            return approval;
        }

        public async Task<Approval> UpdateAsync(Approval approval)
        {
            _context.Approvals.Update(approval);
            await _context.SaveChangesAsync();
            return approval;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var approval = await GetByIdAsync(id);
            if (approval == null) return false;

            _context.Approvals.Remove(approval);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}