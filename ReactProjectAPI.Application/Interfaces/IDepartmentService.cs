using ReactProjectAPI.Application.DTOs;

namespace ReactProjectAPI.Application.Interfaces
{
    public interface IDepartmentService
    {
        Task<IEnumerable<DepartmentDto>> GetAllAsync();
        Task<DepartmentDto> GetByIdAsync(int id);
        Task<DepartmentDto> CreateAsync(CreateDepartmentDto createDto);
        Task<DepartmentDto> UpdateAsync(int id, UpdateDepartmentDto updateDto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<DepartmentDto>> GetByStatusAsync(string status);
    }
}