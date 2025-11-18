using Microsoft.EntityFrameworkCore;
using ReactProjectAPI.Infrastructure.Interfaces;
using ReactProjectAPI.Domain.Entities;
using ReactProjectAPI.Infrastructure.Data;

namespace ReactProjectAPI.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ReactProjectAPIContext _context;

        public UserRepository(ReactProjectAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.Include(u => u.Department).ToListAsync();
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await _context.Users.Include(u => u.Department).FirstOrDefaultAsync(u => u.UserId == id);
        }

        public async Task<User> CreateAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await GetByIdAsync(id);
            if (user == null) return false;
            
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}