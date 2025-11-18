using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReactProjectAPI.Domain.Entities
{
    public class Approval
    {
        [Key]
        public int ApprovalId { get; set; }

        [Required]
        public int ClaimId { get; set; }

        [Required]
        public int ApprovedBy { get; set; } 

        [Required]
        public string Status { get; set; } // Approved / Rejected / Pending

        public string Comments { get; set; }

        public DateTime ApprovalDate { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual Claim Claim { get; set; }
        public virtual User ApprovedByUser { get; set; }
    }
}
