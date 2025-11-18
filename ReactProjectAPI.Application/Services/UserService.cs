using AutoMapper;
using Microsoft.Extensions.Logging;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Interfaces;
using ReactProjectAPI.Infrastructure.Interfaces;
using ReactProjectAPI.Domain.Entities;

namespace ReactProjectAPI.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, IMapper mapper, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            _logger.LogInformation("UserService GetAllAsync started");
            _logger.LogInformation("Calling repository GetAllAsync");
            var users = await _userRepository.GetAllAsync();
            _logger.LogInformation("Repository call completed");
            _logger.LogInformation("Starting AutoMapper mapping");
            var result = _mapper.Map<IEnumerable<UserDto>>(users);
            _logger.LogInformation("AutoMapper mapping completed");
            _logger.LogInformation("UserService GetAllAsync completed");
            return result;
        }

        public async Task<UserDto> GetByIdAsync(int id)
        {
            _logger.LogInformation("UserService GetByIdAsync started for ID: {UserId}", id);
            _logger.LogInformation("Calling repository GetByIdAsync");
            var user = await _userRepository.GetByIdAsync(id);
            _logger.LogInformation("Repository call completed");
            
            if (user == null)
            {
                _logger.LogInformation("User not found, returning null");
                return null;
            }
            
            _logger.LogInformation("Starting AutoMapper mapping");
            var result = _mapper.Map<UserDto>(user);
            _logger.LogInformation("UserService GetByIdAsync completed");
            return result;
        }

        public async Task<UserDto> CreateAsync(CreateUserDto createDto)
        {
            try
            {
                _logger.LogInformation("UserService CreateAsync started");
                _logger.LogInformation("Creating user with email: {Email}", createDto.Email);
                _logger.LogInformation("Starting AutoMapper mapping");
                var user = _mapper.Map<User>(createDto);
                user.CreatedDate = DateTime.Now;
                _logger.LogInformation("AutoMapper mapping completed");
                
                _logger.LogInformation("Calling repository CreateAsync");
                var createdUser = await _userRepository.CreateAsync(user);
                _logger.LogInformation("Repository call completed");
                
                _logger.LogInformation("Starting result mapping");
                var result = _mapper.Map<UserDto>(createdUser);
                _logger.LogInformation("User created successfully with ID: {UserId}", createdUser.UserId);
                _logger.LogInformation("UserService CreateAsync completed");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UserService CreateAsync failed");
                throw;
            }
        }

        public async Task<UserDto> UpdateAsync(int id, CreateUserDto updateDto)
        {
            try
            {
                _logger.LogInformation("UserService UpdateAsync started for ID: {UserId}", id);
                _logger.LogInformation("Calling repository GetByIdAsync");
                var user = await _userRepository.GetByIdAsync(id);
                _logger.LogInformation("Repository call completed");
                
                if (user == null)
                {
                    _logger.LogInformation("User not found, returning null");
                    return null;
                }

                _logger.LogInformation("Starting AutoMapper mapping");
                _mapper.Map(updateDto, user);
                _logger.LogInformation("AutoMapper mapping completed");
                
                _logger.LogInformation("Calling repository UpdateAsync");
                var updatedUser = await _userRepository.UpdateAsync(user);
                _logger.LogInformation("Repository call completed");
                
                _logger.LogInformation("Starting result mapping");
                var result = _mapper.Map<UserDto>(updatedUser);
                _logger.LogInformation("UserService UpdateAsync completed");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UserService UpdateAsync failed");
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                _logger.LogInformation("UserService DeleteAsync started for ID: {UserId}", id);
                _logger.LogInformation("Calling repository DeleteAsync");
                var result = await _userRepository.DeleteAsync(id);
                _logger.LogInformation("Repository call completed");
                
                if (result)
                {
                    _logger.LogInformation("User deleted successfully");
                }
                else
                {
                    _logger.LogInformation("User not found for deletion");
                }
                
                _logger.LogInformation("UserService DeleteAsync completed");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UserService DeleteAsync failed");
                throw;
            }
        }

        public async Task<UserDto> ValidateUserAsync(string email, string password)
        {
            try
            {
                _logger.LogInformation("UserService ValidateUserAsync started for email: {Email}", email);
                _logger.LogInformation("Calling repository GetAllAsync");
                var users = await _userRepository.GetAllAsync();
                _logger.LogInformation("Repository call completed");
                
                var user = users.FirstOrDefault(u => u.Email == email && u.Password == password);
                
                if (user == null)
                {
                    _logger.LogInformation("User validation failed - invalid credentials");
                    return null;
                }
                
                _logger.LogInformation("User validation successful");
                _logger.LogInformation("Starting AutoMapper mapping");
                var result = _mapper.Map<UserDto>(user);
                _logger.LogInformation("UserService ValidateUserAsync completed");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UserService ValidateUserAsync failed");
                throw;
            }
        }


    }
}