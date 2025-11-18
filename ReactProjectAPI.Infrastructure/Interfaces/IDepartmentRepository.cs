using ReactProjectAPI.Domain.Entities;

namespace ReactProjectAPI.Infrastructure.Interfaces
{
    public interface IDepartmentRepository
    {
        Task<IEnumerable<Department>> GetAllAsync();
        Task<Department> GetByIdAsync(int id);
        Task<Department> CreateAsync(Department department);
        Task<Department> UpdateAsync(Department department);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Department>> GetByStatusAsync(string status);
    }
}