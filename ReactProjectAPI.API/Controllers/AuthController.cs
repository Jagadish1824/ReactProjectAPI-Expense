using Microsoft.AspNetCore.Mvc;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Interfaces;

namespace ReactProjectAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public AuthController(IUserService userService, ITokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userService.ValidateUserAsync(loginDto.Email, loginDto.Password);

            if (user == null)
                return Unauthorized("Invalid email or password");

            var token = _tokenService.GenerateToken(user);
            return Ok(new { Token = token, User = user });
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(CreateUserDto createUserDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userService.CreateAsync(createUserDto);
            return Ok(new { Message = "User registered successfully", User = user });
        }
    }
}