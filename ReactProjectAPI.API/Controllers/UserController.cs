using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Interfaces;

namespace ReactProjectAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, IMapper mapper, ILogger<UserController> logger)
        {
            _userService = userService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
        {
            try
            {
                _logger.LogInformation("Getting all users");
                var users = await _userService.GetAllAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetById(int id)
        {
            try
            {
                _logger.LogInformation("Getting user with ID: {UserId}", id);
                var user = await _userService.GetByIdAsync(id);
                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found", id);
                    return NotFound();
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user with ID: {UserId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> Create(CreateUserDto createDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                _logger.LogInformation("Creating new user with email: {Email}", createDto.Email);
                var user = await _userService.CreateAsync(createDto);
                _logger.LogInformation("User created successfully with ID: {UserId}", user.UserId);
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user with email: {Email}", createDto.Email);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Update(int id, CreateUserDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                _logger.LogInformation("Updating user with ID: {UserId}", id);
                var user = await _userService.UpdateAsync(id, updateDto);
                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found for update", id);
                    return NotFound();
                }
                _logger.LogInformation("User with ID {UserId} updated successfully", id);
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user with ID: {UserId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                _logger.LogInformation("Deleting user with ID: {UserId}", id);
                var result = await _userService.DeleteAsync(id);
                if (!result)
                {
                    _logger.LogWarning("User with ID {UserId} not found for deletion", id);
                    return NotFound();
                }
                _logger.LogInformation("User with ID {UserId} deleted successfully", id);
                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user with ID: {UserId}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}