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
    [Authorize]
    public class ClaimController : ControllerBase
    {
        private readonly IClaimService _claimService;
        private readonly IMapper _mapper;
        private readonly ILogger<ClaimController> _logger;

        public ClaimController(IClaimService claimService, IMapper mapper, ILogger<ClaimController> logger)
        {
            _claimService = claimService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "Employee,Manager,Finance")]
        public async Task<ActionResult<IEnumerable<ClaimDto>>> GetAll()
        {
            try
            {
                _logger.LogInformation("Getting all claims");
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userIdClaim = User.FindFirst("userId")?.Value;
                _logger.LogInformation("User role: {Role}, UserId: {UserId}", userRole, userIdClaim);
                
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    _logger.LogWarning("Invalid or missing userId claim in token");
                    return BadRequest("Invalid user token");
                }
                
                if (userRole == "Employee")
                {
                    _logger.LogInformation("Retrieving claims for employee user: {UserId}", userId);
                    var claims = await _claimService.GetClaimsByUserIdAsync(userId);
                    _logger.LogInformation("Retrieved {Count} claims for employee", claims.Count());
                    return Ok(claims);
                }
                
                _logger.LogInformation("Retrieving all claims for {Role}", userRole);
                var allClaims = await _claimService.GetAllAsync();
                _logger.LogInformation("Retrieved {Count} total claims", allClaims.Count());
                return Ok(allClaims);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while getting claims");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Manager,Finance")]
        public async Task<ActionResult<ClaimDto>> GetById(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving claim with ID: {ClaimId}", id);
                var claim = await _claimService.GetByIdAsync(id);
                
                if (claim == null)
                {
                    _logger.LogWarning("Claim not found: {ClaimId}", id);
                    return NotFound();
                }
                
                _logger.LogInformation("Claim retrieved successfully: {ClaimId}", id);
                return Ok(claim);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while getting claim {ClaimId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Employee")]
        public async Task<ActionResult<ClaimDto>> Create(CreateClaimDto createDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    _logger.LogWarning("Invalid or missing userId claim in token");
                    return BadRequest("Invalid user token");
                }
                
                _logger.LogInformation("Creating new claim with title: {Title} for user: {UserId}", createDto.Title, userId);
                var claim = await _claimService.CreateAsync(createDto, userId);
                _logger.LogInformation("Claim created successfully with ID: {ClaimId}", claim.ClaimId);
                return Ok(claim);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating claim with title: {Title}", createDto.Title);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Employee")]
        public async Task<ActionResult<ClaimDto>> Update(int id, UpdateClaimDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return BadRequest("Invalid user token");
                }
                
                // Check if claim belongs to the user
                var existingClaim = await _claimService.GetByIdAsync(id);
                if (existingClaim == null) return NotFound();
                if (existingClaim.UserId != userId) return Forbid();
                
                _logger.LogInformation("Updating claim with ID: {ClaimId} for user: {UserId}", id, userId);
                var claim = await _claimService.UpdateAsync(id, updateDto);
                _logger.LogInformation("Claim with ID {ClaimId} updated successfully", id);
                return Ok(claim);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Invalid operation while updating claim {ClaimId}: {Message}", id, ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating claim with ID: {ClaimId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Employee")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return BadRequest("Invalid user token");
                }
                
                // Check if claim belongs to the user
                var existingClaim = await _claimService.GetByIdAsync(id);
                if (existingClaim == null) return NotFound();
                if (existingClaim.UserId != userId) return Forbid();
                
                _logger.LogInformation("Deleting claim with ID: {ClaimId} for user: {UserId}", id, userId);
                var result = await _claimService.DeleteAsync(id);
                _logger.LogInformation("Claim with ID {ClaimId} deleted successfully", id);
                return Ok(new { message = "Claim deleted successfully" });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Invalid operation while deleting claim {ClaimId}: {Message}", id, ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting claim with ID: {ClaimId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("approved")]
        [Authorize(Roles = "Employee,Manager,Finance")]
        public async Task<ActionResult<IEnumerable<ClaimDto>>> GetApproved()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userIdClaim = User.FindFirst("userId")?.Value;
                
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return BadRequest("Invalid user token");
                }
                
                var claims = await _claimService.GetApprovedClaimsAsync();
                
                if (userRole == "Employee")
                {
                    var userApprovedClaims = claims.Where(c => c.UserId == userId);
                    return Ok(userApprovedClaims);
                }
                
                return Ok(claims);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting approved claims");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("rejected")]
        [Authorize(Roles = "Employee,Manager")]
        public async Task<ActionResult<IEnumerable<ClaimDto>>> GetRejected()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userIdClaim = User.FindFirst("userId")?.Value;
                
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return BadRequest("Invalid user token");
                }
                
                if (userRole == "Employee")
                {
                    var userClaims = await _claimService.GetClaimsByUserIdAsync(userId);
                    var rejectedClaims = userClaims.Where(c => c.Status == "Rejected");
                    return Ok(rejectedClaims);
                }
                
                var claims = await _claimService.GetRejectedClaimsAsync();
                return Ok(claims);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting rejected claims");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("paid")]
        [Authorize(Roles = "Employee,Finance")]
        public async Task<ActionResult<IEnumerable<ClaimDto>>> GetPaid()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userIdClaim = User.FindFirst("userId")?.Value;
                
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return BadRequest("Invalid user token");
                }
                
                if (userRole == "Employee")
                {
                    var userClaims = await _claimService.GetClaimsByUserIdAsync(userId);
                    var paidClaims = userClaims.Where(c => c.Status == "Paid");
                    return Ok(paidClaims);
                }
                
                var claims = await _claimService.GetByStatusAsync("Paid");
                return Ok(claims);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting paid claims");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Employee,Manager")]
        public async Task<ActionResult<IEnumerable<ClaimDto>>> GetPending()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userIdClaim = User.FindFirst("userId")?.Value;
                
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return BadRequest("Invalid user token");
                }
                
                if (userRole == "Employee")
                {
                    var userClaims = await _claimService.GetClaimsByUserIdAsync(userId);
                    var pendingClaims = userClaims.Where(c => c.Status == "Submitted" || c.Status == "Pending");
                    return Ok(pendingClaims);
                }
                
                var claims = await _claimService.GetPendingClaimsAsync();
                return Ok(claims);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting pending claims");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("upload-receipt/{id}")]
        [Authorize(Roles = "Employee")]
        public async Task<ActionResult> UploadReceipt(int id, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded");

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                    return BadRequest("Invalid file type. Only image files are allowed.");

                var userIdClaim = User.FindFirst("userId")?.Value;
                if (!int.TryParse(userIdClaim, out int userId))
                    return BadRequest("Invalid user token");

                var claim = await _claimService.GetByIdAsync(id);
                if (claim == null) return NotFound();
                if (claim.UserId != userId) return Forbid();

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "receipts");
                Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{id}_{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var updateDto = new UpdateClaimDto { ReceiptImage = $"receipts/{fileName}" };
                await _claimService.UpdateAsync(id, updateDto);

                return Ok(new { message = "Receipt uploaded successfully", fileName = $"receipts/{fileName}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading receipt for claim {ClaimId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("receipt/{claimId}")]
        [Authorize(Roles = "Employee,Manager,Finance")]
        public async Task<ActionResult> GetReceipt(int claimId)
        {
            try
            {
                var claim = await _claimService.GetByIdAsync(claimId);
                if (claim == null) return NotFound();

                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userIdClaim = User.FindFirst("userId")?.Value;
                
                if (userRole == "Employee" && int.TryParse(userIdClaim, out int userId) && claim.UserId != userId)
                    return Forbid();

                if (string.IsNullOrEmpty(claim.ReceiptImage))
                    return NotFound("No receipt image found");

                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", claim.ReceiptImage);
                if (!System.IO.File.Exists(filePath))
                    return NotFound("Receipt file not found");

                var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                var contentType = GetContentType(filePath);
                return File(fileBytes, contentType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving receipt for claim {ClaimId}", claimId);
                return StatusCode(500, "Internal server error");
            }
        }

        private string GetContentType(string filePath)
        {
            var extension = Path.GetExtension(filePath).ToLowerInvariant();
            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".bmp" => "image/bmp",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            };
        }
    }
}