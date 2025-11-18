using AutoMapper;
using Microsoft.Extensions.Logging;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Interfaces;
using ReactProjectAPI.Domain.Entities;
using ReactProjectAPI.Infrastructure.Interfaces;

namespace ReactProjectAPI.Application.Services
{
    public class ReimbursementService : IReimbursementService
    {
        private readonly IReimbursementRepository _reimbursementRepository;
        private readonly IClaimRepository _claimRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<ReimbursementService> _logger;

        public ReimbursementService(IReimbursementRepository reimbursementRepository, IClaimRepository claimRepository, IMapper mapper, ILogger<ReimbursementService> logger)
        {
            _reimbursementRepository = reimbursementRepository;
            _claimRepository = claimRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<ReimbursementDto>> GetAllAsync()
        {
            var reimbursements = await _reimbursementRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ReimbursementDto>>(reimbursements);
        }

        public async Task<ReimbursementDto> GetByIdAsync(int id)
        {
            var reimbursement = await _reimbursementRepository.GetByIdAsync(id);
            return _mapper.Map<ReimbursementDto>(reimbursement);
        }

        public async Task<ReimbursementDto> CreateAsync(CreateReimbursementDto createDto)
        {
            try
            {
                _logger.LogInformation("Processing reimbursement for claim ID: {ClaimId} with status: {Status}", createDto.ClaimId, createDto.Status);
                
                var existingReimbursements = await _reimbursementRepository.GetAllAsync();
                
                // Check for duplicate transaction reference
                if (!string.IsNullOrEmpty(createDto.TransactionReference))
                {
                    var duplicateTransaction = existingReimbursements.FirstOrDefault(r => r.TransactionReference == createDto.TransactionReference);
                    if (duplicateTransaction != null)
                    {
                        _logger.LogWarning("Duplicate transaction reference {TransactionReference} found for reimbursement ID: {ReimbursementId}", createDto.TransactionReference, duplicateTransaction.ReimbursementId);
                        throw new InvalidOperationException($"Transaction reference '{createDto.TransactionReference}' already exists. Please use a unique transaction reference.");
                    }
                }
                
                var existingReimbursement = existingReimbursements.FirstOrDefault(r => r.ClaimId == createDto.ClaimId);
                
                if (existingReimbursement != null)
                {
                    _logger.LogInformation("Updating existing reimbursement ID: {ReimbursementId} for claim: {ClaimId}", existingReimbursement.ReimbursementId, createDto.ClaimId);
                    existingReimbursement.PaymentMethod = createDto.PaymentMethod;
                    existingReimbursement.TransactionReference = createDto.TransactionReference;
                    existingReimbursement.Amount = createDto.Amount;
                    existingReimbursement.Status = createDto.Status;
                    existingReimbursement.PaymentDate = DateTime.Now;
                    
                    var updatedReimbursement = await _reimbursementRepository.UpdateAsync(existingReimbursement);
                    
                    if (createDto.Status == "Paid")
                    {
                        var claim = await _claimRepository.GetByIdAsync(createDto.ClaimId);
                        if (claim != null)
                        {
                            claim.Status = "Paid";
                            await _claimRepository.UpdateAsync(claim);
                            _logger.LogInformation("Claim {ClaimId} status updated to Paid", createDto.ClaimId);
                        }
                    }
                    
                    return _mapper.Map<ReimbursementDto>(updatedReimbursement);
                }
                
                var reimbursement = new Reimbursement
                {
                    ClaimId = createDto.ClaimId,
                    ProcessedBy = 1,
                    PaymentMethod = createDto.PaymentMethod,
                    TransactionReference = createDto.TransactionReference,
                    Amount = createDto.Amount,
                    Status = createDto.Status,
                    PaymentDate = DateTime.Now
                };

                var createdReimbursement = await _reimbursementRepository.CreateAsync(reimbursement);
                _logger.LogInformation("New reimbursement created with ID: {ReimbursementId} for claim: {ClaimId}", createdReimbursement.ReimbursementId, createDto.ClaimId);
                
                if (createDto.Status == "Paid")
                {
                    var claim = await _claimRepository.GetByIdAsync(createDto.ClaimId);
                    if (claim != null)
                    {
                        claim.Status = "Paid";
                        await _claimRepository.UpdateAsync(claim);
                        _logger.LogInformation("Claim {ClaimId} status updated to Paid", createDto.ClaimId);
                    }
                }
                
                return _mapper.Map<ReimbursementDto>(createdReimbursement);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing reimbursement for claim ID: {ClaimId}", createDto.ClaimId);
                throw;
            }
        }

        public async Task<ReimbursementDto> UpdateAsync(int id, UpdateReimbursementDto updateDto)
        {
            var reimbursement = await _reimbursementRepository.GetByIdAsync(id);
            if (reimbursement == null) return null;

            // Check for duplicate transaction reference if updating
            if (!string.IsNullOrEmpty(updateDto.TransactionReference) && updateDto.TransactionReference != reimbursement.TransactionReference)
            {
                var existingReimbursements = await _reimbursementRepository.GetAllAsync();
                var duplicateTransaction = existingReimbursements.FirstOrDefault(r => r.TransactionReference == updateDto.TransactionReference && r.ReimbursementId != id);
                if (duplicateTransaction != null)
                {
                    _logger.LogWarning("Duplicate transaction reference {TransactionReference} found for reimbursement ID: {ReimbursementId}", updateDto.TransactionReference, duplicateTransaction.ReimbursementId);
                    throw new InvalidOperationException($"Transaction reference '{updateDto.TransactionReference}' already exists. Please use a unique transaction reference.");
                }
            }

            if (!string.IsNullOrEmpty(updateDto.PaymentMethod))
                reimbursement.PaymentMethod = updateDto.PaymentMethod;
            if (!string.IsNullOrEmpty(updateDto.TransactionReference))
                reimbursement.TransactionReference = updateDto.TransactionReference;
            if (updateDto.Amount.HasValue)
                reimbursement.Amount = updateDto.Amount.Value;
            if (!string.IsNullOrEmpty(updateDto.Status))
                reimbursement.Status = updateDto.Status;

            var updatedReimbursement = await _reimbursementRepository.UpdateAsync(reimbursement);
            
            if (updateDto.Status == "Paid")
            {
                var claim = await _claimRepository.GetByIdAsync(reimbursement.ClaimId);
                if (claim != null)
                {
                    claim.Status = "Paid";
                    await _claimRepository.UpdateAsync(claim);
                }
            }
            
            return _mapper.Map<ReimbursementDto>(updatedReimbursement);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _reimbursementRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<ReimbursementDto>> GetByStatusAsync(string status)
        {
            var reimbursements = await _reimbursementRepository.GetByStatusAsync(status);
            return _mapper.Map<IEnumerable<ReimbursementDto>>(reimbursements);
        }


    }
}