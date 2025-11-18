using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReactProjectAPI.Domain.Entities
{
    public class Claim
    {
        [Key]
        public int ClaimId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required, StringLength(200)]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        public int CategoryId { get; set; }  // Foreign key

        [Required, Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public DateTime ExpenseDate { get; set; }

        public string ReceiptImage { get; set; }

        [Required]
        public string Status { get; set; } = "Submitted"; // Submitted / Approved / Rejected / Paid

        public DateTime SubmittedDate { get; set; } = DateTime.Now;

        public string Comments { get; set; }

        // Navigation properties
        public virtual User User { get; set; }
        public virtual ExpenseCategory Category { get; set; }
        public virtual Approval Approval { get; set; }
        public virtual Reimbursement Reimbursement { get; set; }
    }
}
