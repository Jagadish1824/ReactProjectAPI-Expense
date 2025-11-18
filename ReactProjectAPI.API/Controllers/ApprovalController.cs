using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Interfaces;
using System.Security.Claims;

namespace ReactProjectAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Manager")]
    public class ApprovalController : ControllerBase
    {
        private readonly IApprovalService _approvalService;
        private readonly IClaimService _claimService;
        private readonly IMapper _mapper;
        private readonly ILogger<ApprovalController> _logger;

        public ApprovalController(IApprovalService approvalService, IClaimService claimService, IMapper mapper, ILogger<ApprovalController> logger)
        {
            _approvalService = approvalService;
            _claimService = claimService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApprovalDto>>> GetAll()
        {
            var approvals = await _approvalService.GetAllAsync();
            return Ok(approvals);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApprovalDto>> GetById(int id)
        {
            var approval = await _approvalService.GetByIdAsync(id);
            if (approval == null) return NotFound();
            return Ok(approval);
        }

        [HttpPost]
        public async Task<ActionResult<ApprovalDto>> Create(CreateApprovalDto createDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (!int.TryParse(userIdClaim, out int managerId))
                    return BadRequest("Invalid user token");
                
                _logger.LogInformation("Creating approval for claim ID: {ClaimId}", createDto.ClaimId);
                var approval = await _approvalService.CreateAsync(createDto, managerId);
                _logger.LogInformation("Approval created successfully with ID: {ApprovalId}", approval.ApprovalId);
                return Ok(approval);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating approval for claim ID: {ClaimId}", createDto.ClaimId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("pending-claims")]
        public async Task<ActionResult<IEnumerable<ClaimDto>>> GetPendingClaims()
        {
            var claims = await _claimService.GetPendingClaimsAsync();
            return Ok(claims);
        }

        [HttpGet("rejected-claims")]
        public async Task<ActionResult<IEnumerable<ClaimDto>>> GetRejectedClaims()
        {
            var claims = await _claimService.GetRejectedClaimsAsync();
            return Ok(claims);
        }

        [HttpGet("my-approved-claims")]
        public async Task<ActionResult<IEnumerable<ClaimDto>>> GetMyApprovedClaims()
        {
            var claims = await _claimService.GetApprovedClaimsAsync();
            return Ok(claims);
        }

    }
}