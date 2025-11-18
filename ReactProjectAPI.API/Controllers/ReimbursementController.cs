using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Interfaces;

namespace ReactProjectAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles ="Finance")]
    public class ReimbursementController : ControllerBase
    {
        private readonly IReimbursementService _reimbursementService;
        private readonly IClaimService _claimService;
        private readonly IMapper _mapper;
        private readonly ILogger<ReimbursementController> _logger;

        public ReimbursementController(IReimbursementService reimbursementService, IClaimService claimService, IMapper mapper, ILogger<ReimbursementController> logger)
        {
            _reimbursementService = reimbursementService;
            _claimService = claimService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReimbursementDto>>> GetAll()
        {
            var reimbursements = await _reimbursementService.GetAllAsync();
            return Ok(reimbursements);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReimbursementDto>> GetById(int id)
        {
            var reimbursement = await _reimbursementService.GetByIdAsync(id);
            if (reimbursement == null) return NotFound();
            return Ok(reimbursement);
        }

        [HttpPost]
        public async Task<ActionResult<ReimbursementDto>> Create(CreateReimbursementDto createDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                _logger.LogInformation("Creating reimbursement for claim ID: {ClaimId}", createDto.ClaimId);
                var reimbursement = await _reimbursementService.CreateAsync(createDto);
                _logger.LogInformation("Reimbursement created successfully with ID: {ReimbursementId}", reimbursement.ReimbursementId);
                return Ok(reimbursement);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Validation error creating reimbursement for claim ID: {ClaimId}", createDto.ClaimId);
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating reimbursement for claim ID: {ClaimId}", createDto.ClaimId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ReimbursementDto>> Update(int id, UpdateReimbursementDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                _logger.LogInformation("Updating reimbursement ID: {ReimbursementId}", id);
                var reimbursement = await _reimbursementService.UpdateAsync(id, updateDto);
                if (reimbursement == null) return NotFound();
                _logger.LogInformation("Reimbursement updated successfully with ID: {ReimbursementId}", id);
                return Ok(reimbursement);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Validation error updating reimbursement ID: {ReimbursementId}", id);
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating reimbursement ID: {ReimbursementId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("approved-claims")]
        public async Task<ActionResult<IEnumerable<ClaimDto>>> GetApprovedClaimsForReimbursement()
        {
            var approvedClaims = await _claimService.GetApprovedClaimsAsync();
            var allReimbursements = await _reimbursementService.GetAllAsync();
            var processedClaimIds = allReimbursements.Select(r => r.ClaimId).ToHashSet();
            
            var unprocessedClaims = approvedClaims.Where(c => !processedClaimIds.Contains(c.ClaimId));
            return Ok(unprocessedClaims);
        }
    }
}