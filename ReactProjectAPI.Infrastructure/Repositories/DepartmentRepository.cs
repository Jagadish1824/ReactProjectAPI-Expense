using Microsoft.EntityFrameworkCore;
using ReactProjectAPI.Infrastructure.Interfaces;
using ReactProjectAPI.Domain.Entities;
using ReactProjectAPI.Infrastructure.Data;

namespace ReactProjectAPI.Infrastructure.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly ReactProjectAPIContext _context;

        public DepartmentRepository(ReactProjectAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Department>> GetAllAsync()
        {
            return await _context.Departments.ToListAsync();
        }

        public async Task<Department> GetByIdAsync(int id)
        {
            return await _context.Departments.FirstOrDefaultAsync(d => d.DepartmentId == id);
        }

        public async Task<Department> CreateAsync(Department department)
        {
            _context.Departments.Add(department);
            await _context.SaveChangesAsync();
            return department;
        }

        public async Task<Department> UpdateAsync(Department department)
        {
            _context.Departments.Update(department);
            await _context.SaveChangesAsync();
            return department;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var department = await GetByIdAsync(id);
            if (department == null) return false;

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Department>> GetByStatusAsync(string status)
        {
            return await _context.Departments.Where(d => d.DepartmentName.Contains(status)).ToListAsync();
        }
    }
}