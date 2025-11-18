using Microsoft.EntityFrameworkCore;
using ReactProjectAPI.Infrastructure.Interfaces;
using ReactProjectAPI.Domain.Entities;
using ReactProjectAPI.Infrastructure.Data;

namespace ReactProjectAPI.Infrastructure.Repositories
{
    public class ClaimRepository : IClaimRepository
    {
        private readonly ReactProjectAPIContext _context;

        public ClaimRepository(ReactProjectAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Claim>> GetAllAsync()
        {
            return await _context.Claims
                .Include(c => c.User)
                .Include(c => c.Category)
                .ToListAsync();
        }

        public async Task<Claim> GetByIdAsync(int id)
        {
            return await _context.Claims
                .Include(c => c.User)
                .Include(c => c.Category)
                .FirstOrDefaultAsync(c => c.ClaimId == id);
        }

        public async Task<Claim> CreateAsync(Claim claim)
        {
            _context.Claims.Add(claim);
            await _context.SaveChangesAsync();
            return claim;
        }

        public async Task<Claim> UpdateAsync(Claim claim)
        {
            _context.Claims.Update(claim);
            await _context.SaveChangesAsync();
            return claim;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var claim = await GetByIdAsync(id);
            if (claim == null) return false;

            _context.Claims.Remove(claim);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Claim>> GetByStatusAsync(string status)
        {
            return await _context.Claims
                .Include(c => c.User)
                .Include(c => c.Category)
                .Where(c => c.Status == status)
                .ToListAsync();
        }

        public async Task<IEnumerable<Claim>> GetPendingClaimsAsync()
        {
            return await _context.Claims
                .Include(c => c.User)
                .Include(c => c.Category)
                .Where(c => c.Status == "Submitted" || c.Status == "Pending")
                .ToListAsync();
        }

        public async Task<IEnumerable<Claim>> GetApprovedClaimsAsync()
        {
            return await _context.Claims
                .Include(c => c.User)
                .Include(c => c.Category)
                .Include(c => c.Approval)
                .Where(c => c.Approval != null && c.Approval.Status == "Approved")
                .OrderByDescending(c => c.Approval.ApprovalDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Claim>> GetRejectedClaimsAsync()
        {
            return await _context.Claims
                .Include(c => c.User)
                .Include(c => c.Category)
                .Include(c => c.Approval)
                .Where(c => c.Approval != null && c.Approval.Status == "Rejected")
                .ToListAsync();
        }

        public async Task<IEnumerable<Claim>> GetClaimsByUserIdAsync(int userId)
        {
            return await _context.Claims
                .Include(c => c.User)
                .Include(c => c.Category)
                .Where(c => c.UserId == userId)
                .ToListAsync();
        }
    }
}