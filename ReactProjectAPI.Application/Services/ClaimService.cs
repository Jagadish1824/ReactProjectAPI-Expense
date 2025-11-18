using AutoMapper;
using Microsoft.Extensions.Logging;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Interfaces;
using ReactProjectAPI.Infrastructure.Interfaces;
using ReactProjectAPI.Domain.Entities;

namespace ReactProjectAPI.Application.Services
{
    public class ClaimService : IClaimService
    {
        private readonly IClaimRepository _claimRepository;
        private readonly IExpenseCategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<ClaimService> _logger;

        public ClaimService(IClaimRepository claimRepository, IExpenseCategoryRepository categoryRepository, IMapper mapper, ILogger<ClaimService> logger)
        {
            _claimRepository = claimRepository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<ClaimDto>> GetAllAsync()
        {
            _logger.LogInformation("ClaimService GetAllAsync started");
            _logger.LogInformation("Calling repository GetAllAsync");
            var claims = await _claimRepository.GetAllAsync();
            _logger.LogInformation("Repository call completed");
            _logger.LogInformation("Starting AutoMapper mapping");
            var result = _mapper.Map<IEnumerable<ClaimDto>>(claims);
            _logger.LogInformation("AutoMapper mapping completed");
            _logger.LogInformation("ClaimService GetAllAsync completed");
            return result;
        }

        public async Task<ClaimDto> GetByIdAsync(int id)
        {
            _logger.LogInformation("ClaimService GetByIdAsync started for ID: {ClaimId}", id);
            _logger.LogInformation("Calling repository GetByIdAsync");
            var claim = await _claimRepository.GetByIdAsync(id);
            _logger.LogInformation("Repository call completed");
            
            if (claim == null)
            {
                _logger.LogInformation("Claim not found, returning null");
                return null;
            }
            
            _logger.LogInformation("Starting AutoMapper mapping");
            var result = _mapper.Map<ClaimDto>(claim);
            _logger.LogInformation("ClaimService GetByIdAsync completed");
            return result;
        }

        public async Task<ClaimDto> CreateAsync(CreateClaimDto createDto, int userId)
        {
            try
            {
                _logger.LogInformation("Creating claim with title: {Title} for user: {UserId}", createDto.Title, userId);
                
                // Validate amount against category limits
                var category = await _categoryRepository.GetByIdAsync(createDto.CategoryId);
                if (category == null)
                {
                    throw new ArgumentException("Invalid category selected.");
                }
                
                if (createDto.Amount < category.MinAmount || createDto.Amount > category.MaxAmount)
                {
                    throw new ArgumentException($"Amount must be between {category.MinAmount:C} and {category.MaxAmount:C} for {category.CategoryName} category.");
                }
                
                var claim = _mapper.Map<Claim>(createDto);
                claim.UserId = userId;
                claim.Status = "Submitted";
                claim.SubmittedDate = DateTime.Now;

                var createdClaim = await _claimRepository.CreateAsync(claim);
                _logger.LogInformation("Claim created successfully with ID: {ClaimId} for user: {UserId}", createdClaim.ClaimId, userId);
                return _mapper.Map<ClaimDto>(createdClaim);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating claim for user: {UserId}", userId);
                throw;
            }
        }

        public async Task<ClaimDto> CreateAsync(CreateClaimDto createDto)
        {
            return await CreateAsync(createDto, 1); // Default fallback
        }

        public async Task<IEnumerable<ClaimDto>> GetClaimsByUserIdAsync(int userId)
        {
            _logger.LogInformation("ClaimService GetClaimsByUserIdAsync started for user: {UserId}", userId);
            _logger.LogInformation("Calling repository GetClaimsByUserIdAsync");
            var claims = await _claimRepository.GetClaimsByUserIdAsync(userId);
            _logger.LogInformation("Repository call completed");
            _logger.LogInformation("Starting AutoMapper mapping");
            var result = _mapper.Map<IEnumerable<ClaimDto>>(claims);
            _logger.LogInformation("AutoMapper mapping completed");
            _logger.LogInformation("ClaimService GetClaimsByUserIdAsync completed");
            return result;
        }

        public async Task<ClaimDto> UpdateAsync(int id, UpdateClaimDto updateDto)
        {
            try
            {
                _logger.LogInformation("Updating claim with ID: {ClaimId}", id);
                var claim = await _claimRepository.GetByIdAsync(id);
                if (claim == null)
                {
                    _logger.LogWarning("Claim with ID {ClaimId} not found for update", id);
                    return null;
                }

                if (claim.Status != "Submitted")
                {
                    _logger.LogWarning("Cannot edit claim {ClaimId}. Status is {Status}, only 'Submitted' claims can be edited", id, claim.Status);
                    throw new InvalidOperationException("Cannot edit claim. Only claims with 'Submitted' status can be edited.");
                }

                // Validate amount and category if being updated
                var categoryId = updateDto.CategoryId ?? claim.CategoryId;
                var amount = updateDto.Amount ?? claim.Amount;
                
                var category = await _categoryRepository.GetByIdAsync(categoryId);
                if (category == null)
                {
                    throw new ArgumentException("Invalid category selected.");
                }
                
                if (amount < category.MinAmount || amount > category.MaxAmount)
                {
                    throw new ArgumentException($"Amount must be between {category.MinAmount:C} and {category.MaxAmount:C} for {category.CategoryName} category.");
                }

                if (!string.IsNullOrEmpty(updateDto.Title))
                    claim.Title = updateDto.Title;
                if (!string.IsNullOrEmpty(updateDto.Description))
                    claim.Description = updateDto.Description;
                if (updateDto.CategoryId.HasValue)
                    claim.CategoryId = updateDto.CategoryId.Value;
                if (updateDto.Amount.HasValue)
                    claim.Amount = updateDto.Amount.Value;
                if (updateDto.ExpenseDate.HasValue)
                    claim.ExpenseDate = updateDto.ExpenseDate.Value;
                if (!string.IsNullOrEmpty(updateDto.ReceiptImage))
                    claim.ReceiptImage = updateDto.ReceiptImage;

                var updatedClaim = await _claimRepository.UpdateAsync(claim);
                _logger.LogInformation("Claim with ID {ClaimId} updated successfully", id);
                return _mapper.Map<ClaimDto>(updatedClaim);
            }
            catch (Exception ex) when (!(ex is InvalidOperationException) && !(ex is ArgumentException))
            {
                _logger.LogError(ex, "Error updating claim with ID: {ClaimId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                _logger.LogInformation("Deleting claim with ID: {ClaimId}", id);
                var claim = await _claimRepository.GetByIdAsync(id);
                if (claim == null)
                {
                    _logger.LogWarning("Claim with ID {ClaimId} not found for deletion", id);
                    return false;
                }

                if (claim.Status != "Submitted")
                {
                    _logger.LogWarning("Cannot delete claim {ClaimId}. Status is {Status}, only 'Submitted' claims can be deleted", id, claim.Status);
                    throw new InvalidOperationException("Cannot delete claim. Only claims with 'Submitted' status can be deleted.");
                }

                var result = await _claimRepository.DeleteAsync(id);
                _logger.LogInformation("Claim with ID {ClaimId} deleted successfully", id);
                return result;
            }
            catch (Exception ex) when (!(ex is InvalidOperationException))
            {
                _logger.LogError(ex, "Error deleting claim with ID: {ClaimId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<ClaimDto>> GetByStatusAsync(string status)
        {
            var claims = await _claimRepository.GetByStatusAsync(status);
            return _mapper.Map<IEnumerable<ClaimDto>>(claims);
        }

        public async Task<IEnumerable<ClaimDto>> GetPendingClaimsAsync()
        {
            var claims = await _claimRepository.GetPendingClaimsAsync();
            var claimDtos = _mapper.Map<IEnumerable<ClaimDto>>(claims);
            
            foreach (var dto in claimDtos)
            {
                if (!string.IsNullOrEmpty(dto.ReceiptImage))
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", dto.ReceiptImage);
                    if (File.Exists(filePath))
                    {
                        var fileBytes = File.ReadAllBytes(filePath);
                        var extension = Path.GetExtension(dto.ReceiptImage).ToLowerInvariant();
                        var mimeType = extension switch
                        {
                            ".jpg" or ".jpeg" => "image/jpeg",
                            ".png" => "image/png",
                            ".gif" => "image/gif",
                            ".bmp" => "image/bmp",
                            ".webp" => "image/webp",
                            _ => "image/jpeg"
                        };
                        dto.ReceiptImage = $"data:{mimeType};base64,{Convert.ToBase64String(fileBytes)}";
                    }
                }
            }
            
            return claimDtos;
        }

        public async Task<IEnumerable<ClaimDto>> GetApprovedClaimsAsync()
        {
            var claims = await _claimRepository.GetApprovedClaimsAsync();
            var claimDtos = _mapper.Map<IEnumerable<ClaimDto>>(claims);
            
            foreach (var dto in claimDtos)
            {
                if (!string.IsNullOrEmpty(dto.ReceiptImage))
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", dto.ReceiptImage);
                    if (File.Exists(filePath))
                    {
                        var fileBytes = File.ReadAllBytes(filePath);
                        var extension = Path.GetExtension(dto.ReceiptImage).ToLowerInvariant();
                        var mimeType = extension switch
                        {
                            ".jpg" or ".jpeg" => "image/jpeg",
                            ".png" => "image/png",
                            ".gif" => "image/gif",
                            ".bmp" => "image/bmp",
                            ".webp" => "image/webp",
                            _ => "image/jpeg"
                        };
                        dto.ReceiptImage = $"data:{mimeType};base64,{Convert.ToBase64String(fileBytes)}";
                    }
                }
            }
            
            return claimDtos;
        }

        public async Task<IEnumerable<ClaimDto>> GetRejectedClaimsAsync()
        {
            var claims = await _claimRepository.GetRejectedClaimsAsync();
            return _mapper.Map<IEnumerable<ClaimDto>>(claims);
        }


    }
}