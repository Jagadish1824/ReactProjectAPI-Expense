using AutoMapper;
using Microsoft.Extensions.Logging;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Interfaces;
using ReactProjectAPI.Domain.Entities;
using ReactProjectAPI.Infrastructure.Interfaces;

namespace ReactProjectAPI.Application.Services
{
    public class ExpenseCategoryService : IExpenseCategoryService
    {
        private readonly IExpenseCategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<ExpenseCategoryService> _logger;

        public ExpenseCategoryService(IExpenseCategoryRepository categoryRepository, IMapper mapper, ILogger<ExpenseCategoryService> logger)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<ExpenseCategoryDto>> GetAllAsync()
        {
            _logger.LogInformation("ExpenseCategoryService GetAllAsync started");
            _logger.LogInformation("Calling repository GetAllAsync");
            var categories = await _categoryRepository.GetAllAsync();
            _logger.LogInformation("Repository call completed");
            _logger.LogInformation("Starting AutoMapper mapping");
            var result = _mapper.Map<IEnumerable<ExpenseCategoryDto>>(categories);
            _logger.LogInformation("AutoMapper mapping completed");
            _logger.LogInformation("ExpenseCategoryService GetAllAsync completed");
            return result;
        }

        public async Task<ExpenseCategoryDto> GetByIdAsync(int id)
        {
            _logger.LogInformation("ExpenseCategoryService GetByIdAsync started for ID: {CategoryId}", id);
            _logger.LogInformation("Calling repository GetByIdAsync");
            var category = await _categoryRepository.GetByIdAsync(id);
            _logger.LogInformation("Repository call completed");
            
            if (category == null)
            {
                _logger.LogInformation("Category not found, returning null");
                return null;
            }
            
            _logger.LogInformation("Starting AutoMapper mapping");
            var result = _mapper.Map<ExpenseCategoryDto>(category);
            _logger.LogInformation("ExpenseCategoryService GetByIdAsync completed");
            return result;
        }

        public async Task<ExpenseCategoryDto> CreateAsync(CreateExpenseCategoryDto createDto)
        {
            var category = _mapper.Map<ExpenseCategory>(createDto);
            var createdCategory = await _categoryRepository.CreateAsync(category);
            return _mapper.Map<ExpenseCategoryDto>(createdCategory);
        }

        public async Task<ExpenseCategoryDto> UpdateAsync(int id, UpdateExpenseCategoryDto updateDto)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return null;

            if (!string.IsNullOrEmpty(updateDto.CategoryName))
                category.CategoryName = updateDto.CategoryName;
            if (!string.IsNullOrEmpty(updateDto.Description))
                category.Description = updateDto.Description;

            var updatedCategory = await _categoryRepository.UpdateAsync(category);
            return _mapper.Map<ExpenseCategoryDto>(updatedCategory);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _categoryRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<ExpenseCategoryDto>> GetByStatusAsync(string status)
        {
            var categories = await _categoryRepository.GetByStatusAsync(status);
            return _mapper.Map<IEnumerable<ExpenseCategoryDto>>(categories);
        }


    }
}