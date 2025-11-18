using ReactProjectAPI.Application.DTOs;

namespace ReactProjectAPI.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(UserDto user);
    }
}