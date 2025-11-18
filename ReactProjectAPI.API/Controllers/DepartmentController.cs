using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Interfaces;

namespace ReactProjectAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;
        private readonly IMapper _mapper;
        private readonly ILogger<DepartmentController> _logger;

        public DepartmentController(IDepartmentService departmentService, IMapper mapper, ILogger<DepartmentController> logger)
        {
            _departmentService = departmentService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetAll()
        {
            try
            {
                _logger.LogInformation("Retrieving all departments");
                var departments = await _departmentService.GetAllAsync();
                _logger.LogInformation("Retrieved {Count} departments", departments.Count());
                return Ok(departments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while getting all departments");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentDto>> GetById(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving department with ID: {DepartmentId}", id);
                var department = await _departmentService.GetByIdAsync(id);
                
                if (department == null)
                {
                    _logger.LogWarning("Department not found: {DepartmentId}", id);
                    return NotFound();
                }
                
                return Ok(department);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while getting department {DepartmentId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Finance")]
        public async Task<ActionResult<DepartmentDto>> Create(CreateDepartmentDto createDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var department = await _departmentService.CreateAsync(createDto);
            return Ok(department);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Finance")]
        public async Task<ActionResult<DepartmentDto>> Update(int id, UpdateDepartmentDto updateDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var department = await _departmentService.UpdateAsync(id, updateDto);
            if (department == null) return NotFound();
            return Ok(department);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Finance")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _departmentService.DeleteAsync(id);
            if (!result) return NotFound();
            return Ok(new { message = "Department deleted successfully" });
        }
    }
}