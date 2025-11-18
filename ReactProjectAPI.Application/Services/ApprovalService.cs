using AutoMapper;
using Microsoft.Extensions.Logging;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Interfaces;
using ReactProjectAPI.Domain.Entities;
using ReactProjectAPI.Infrastructure.Interfaces;

namespace ReactProjectAPI.Application.Services
{
    public class ApprovalService : IApprovalService
    {
        private readonly IApprovalRepository _approvalRepository;
        private readonly IClaimRepository _claimRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<ApprovalService> _logger;

        public ApprovalService(IApprovalRepository approvalRepository, IClaimRepository claimRepository, IMapper mapper, ILogger<ApprovalService> logger)
        {
            _approvalRepository = approvalRepository;
            _claimRepository = claimRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<ApprovalDto>> GetAllAsync()
        {
            var approvals = await _approvalRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ApprovalDto>>(approvals);
        }

        public async Task<ApprovalDto> GetByIdAsync(int id)
        {
            var approval = await _approvalRepository.GetByIdAsync(id);
            return _mapper.Map<ApprovalDto>(approval);
        }

        public async Task<ApprovalDto> CreateAsync(CreateApprovalDto createDto, int managerId)
        {
            try
            {
                _logger.LogInformation("Processing approval for claim ID: {ClaimId} with status: {Status}", createDto.ClaimId, createDto.Status);
                
                // Check if approval already exists for this claim
                var existingApprovals = await _approvalRepository.GetAllAsync();
                var existingApproval = existingApprovals.FirstOrDefault(a => a.ClaimId == createDto.ClaimId);
                
                if (existingApproval != null)
                {
                    _logger.LogInformation("Updating existing approval ID: {ApprovalId} for claim: {ClaimId}", existingApproval.ApprovalId, createDto.ClaimId);
                    // Update existing approval instead of creating new one
                    existingApproval.Status = createDto.Status;
                    existingApproval.Comments = createDto.Comments;
                    existingApproval.ApprovalDate = DateTime.Now;
                    existingApproval.ApprovedBy = managerId;
                    
                    var updatedApproval = await _approvalRepository.UpdateAsync(existingApproval);
                    
                    // Update claim status and comments
                    var claim = await _claimRepository.GetByIdAsync(createDto.ClaimId);
                    if (claim != null)
                    {
                        claim.Status = createDto.Status;
                        claim.Comments = createDto.Comments; // Copy approval comments to claim
                        await _claimRepository.UpdateAsync(claim);
                        _logger.LogInformation("Claim {ClaimId} status updated to: {Status} with comments", createDto.ClaimId, createDto.Status);
                    }
                    
                    return _mapper.Map<ApprovalDto>(updatedApproval);
                }
                
                // Create new approval if none exists
                var approval = new Approval
                {
                    ClaimId = createDto.ClaimId,
                    ApprovedBy = managerId,
                    Status = createDto.Status,
                    Comments = createDto.Comments,
                    ApprovalDate = DateTime.Now
                };

                var createdApproval = await _approvalRepository.CreateAsync(approval);
                _logger.LogInformation("New approval created with ID: {ApprovalId} for claim: {ClaimId}", createdApproval.ApprovalId, createDto.ClaimId);
                
                // Update claim status and comments
                var claimToUpdate = await _claimRepository.GetByIdAsync(createDto.ClaimId);
                if (claimToUpdate != null)
                {
                    claimToUpdate.Status = createDto.Status;
                    claimToUpdate.Comments = createDto.Comments; // Copy approval comments to claim
                    await _claimRepository.UpdateAsync(claimToUpdate);
                    _logger.LogInformation("Claim {ClaimId} status updated to: {Status} with comments", createDto.ClaimId, createDto.Status);
                }
                
                return _mapper.Map<ApprovalDto>(createdApproval);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing approval for claim ID: {ClaimId}", createDto.ClaimId);
                throw;
            }
        }

        public async Task<ApprovalDto> CreateAsync(CreateApprovalDto createDto)
        {
            return await CreateAsync(createDto, 1); // Default fallback
        }

        public async Task<ApprovalDto> UpdateAsync(int id, UpdateApprovalDto updateDto)
        {
            var approval = await _approvalRepository.GetByIdAsync(id);
            if (approval == null) return null;

            if (!string.IsNullOrEmpty(updateDto.Status))
                approval.Status = updateDto.Status;
            if (!string.IsNullOrEmpty(updateDto.Comments))
                approval.Comments = updateDto.Comments;

            approval.ApprovalDate = DateTime.Now;

            var updatedApproval = await _approvalRepository.UpdateAsync(approval);
            
            // Update the claim status and comments to match the approval decision
            if (!string.IsNullOrEmpty(updateDto.Status))
            {
                var claim = await _claimRepository.GetByIdAsync(approval.ClaimId);
                if (claim != null)
                {
                    claim.Status = updateDto.Status;
                    if (!string.IsNullOrEmpty(updateDto.Comments))
                        claim.Comments = updateDto.Comments; // Copy approval comments to claim
                    await _claimRepository.UpdateAsync(claim);
                }
            }
            
            return _mapper.Map<ApprovalDto>(updatedApproval);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _approvalRepository.DeleteAsync(id);
        }


    }
}