using ReactProjectAPI.Application.DTOs;

namespace ReactProjectAPI.Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto> GetByIdAsync(int id);
        Task<UserDto> CreateAsync(CreateUserDto createDto);
        Task<UserDto> UpdateAsync(int id, CreateUserDto updateDto);
        Task<bool> DeleteAsync(int id);
        Task<UserDto> ValidateUserAsync(string email, string password);
    }
}