using System.ComponentModel.DataAnnotations;

namespace ReactProjectAPI.Application.DTOs
{
    public class ApprovalDto
    {
        public int ApprovalId { get; set; }
        public int ClaimId { get; set; }
        public string ClaimTitle { get; set; }
        public int ApprovedBy { get; set; }
        public string ApproverName { get; set; }
        public string Status { get; set; }
        public string Comments { get; set; }
        public DateTime ApprovalDate { get; set; }
    }

    public class CreateApprovalDto
    {
        [Required(ErrorMessage = "Claim ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Please select a valid claim")]
        public int ClaimId { get; set; }

        [Required(ErrorMessage = "Status is required")]
        [RegularExpression("^(Approved|Rejected|Pending)$", ErrorMessage = "Status must be Approved, Rejected, or Pending")]
        public string Status { get; set; }

        [StringLength(1000, ErrorMessage = "Comments cannot exceed 1000 characters")]
        public string Comments { get; set; }
    }

    public class UpdateApprovalDto
    {
        [RegularExpression("^(Approved|Rejected|Pending)$", ErrorMessage = "Status must be Approved, Rejected, or Pending")]
        public string Status { get; set; }

        [StringLength(1000, ErrorMessage = "Comments cannot exceed 1000 characters")]
        public string Comments { get; set; }
    }
}