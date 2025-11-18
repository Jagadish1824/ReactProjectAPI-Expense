using AutoMapper;
using Microsoft.Extensions.Logging;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Interfaces;
using ReactProjectAPI.Infrastructure.Interfaces;
using ReactProjectAPI.Domain.Entities;

namespace ReactProjectAPI.Application.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<DepartmentService> _logger;

        public DepartmentService(IDepartmentRepository departmentRepository, IMapper mapper, ILogger<DepartmentService> logger)
        {
            _departmentRepository = departmentRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
        {
            _logger.LogInformation("DepartmentService GetAllAsync started");
            _logger.LogInformation("Calling repository GetAllAsync");
            var departments = await _departmentRepository.GetAllAsync();
            _logger.LogInformation("Repository call completed");
            _logger.LogInformation("Starting AutoMapper mapping");
            var result = _mapper.Map<IEnumerable<DepartmentDto>>(departments);
            _logger.LogInformation("AutoMapper mapping completed");
            _logger.LogInformation("DepartmentService GetAllAsync completed");
            return result;
        }

        public async Task<DepartmentDto> GetByIdAsync(int id)
        {
            _logger.LogInformation("DepartmentService GetByIdAsync started for ID: {DepartmentId}", id);
            _logger.LogInformation("Calling repository GetByIdAsync");
            var department = await _departmentRepository.GetByIdAsync(id);
            _logger.LogInformation("Repository call completed");
            
            if (department == null)
            {
                _logger.LogInformation("Department not found, returning null");
                return null;
            }
            
            _logger.LogInformation("Starting AutoMapper mapping");
            var result = _mapper.Map<DepartmentDto>(department);
            _logger.LogInformation("DepartmentService GetByIdAsync completed");
            return result;
        }

        public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto createDto)
        {
            var department = _mapper.Map<Department>(createDto);
            var createdDepartment = await _departmentRepository.CreateAsync(department);
            return _mapper.Map<DepartmentDto>(createdDepartment);
        }

        public async Task<DepartmentDto> UpdateAsync(int id, UpdateDepartmentDto updateDto)
        {
            var department = await _departmentRepository.GetByIdAsync(id);
            if (department == null) return null;

            if (!string.IsNullOrEmpty(updateDto.DepartmentName))
                department.DepartmentName = updateDto.DepartmentName;
            if (!string.IsNullOrEmpty(updateDto.Description))
                department.Description = updateDto.Description;

            var updatedDepartment = await _departmentRepository.UpdateAsync(department);
            return _mapper.Map<DepartmentDto>(updatedDepartment);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _departmentRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<DepartmentDto>> GetByStatusAsync(string status)
        {
            var departments = await _departmentRepository.GetByStatusAsync(status);
            return _mapper.Map<IEnumerable<DepartmentDto>>(departments);
        }


    }
}