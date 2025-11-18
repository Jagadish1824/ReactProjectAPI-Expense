using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Interfaces;

namespace ReactProjectAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ExpenseCategoryController : ControllerBase
    {
        private readonly IExpenseCategoryService _categoryService;
        private readonly IMapper _mapper;
        private readonly ILogger<ExpenseCategoryController> _logger;

        public ExpenseCategoryController(IExpenseCategoryService categoryService, IMapper mapper, ILogger<ExpenseCategoryController> logger)
        {
            _categoryService = categoryService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseCategoryDto>>> GetAll()
        {
            try
            {
                _logger.LogInformation("Retrieving all expense categories");
                var categories = await _categoryService.GetAllAsync();
                _logger.LogInformation("Retrieved {Count} expense categories", categories.Count());
                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while getting all expense categories");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseCategoryDto>> GetById(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving expense category with ID: {CategoryId}", id);
                var category = await _categoryService.GetByIdAsync(id);
                
                if (category == null)
                {
                    _logger.LogWarning("Expense category not found: {CategoryId}", id);
                    return NotFound();
                }
                
                return Ok(category);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while getting expense category {CategoryId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Finance")]
        public async Task<ActionResult<ExpenseCategoryDto>> Create(CreateExpenseCategoryDto createDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var category = await _categoryService.CreateAsync(createDto);
            return Ok(category);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Finance")]
        public async Task<ActionResult<ExpenseCategoryDto>> Update(int id, UpdateExpenseCategoryDto updateDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var category = await _categoryService.UpdateAsync(id, updateDto);
            if (category == null) return NotFound();
            return Ok(category);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Finance")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _categoryService.DeleteAsync(id);
            if (!result) return NotFound();
            return Ok(new { message = "Expense category deleted successfully" });
        }
    }
}