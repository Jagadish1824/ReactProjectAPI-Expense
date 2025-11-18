using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReactProjectAPI.Domain.Entities
{
    public class Reimbursement
    {
        [Key]
        public int ReimbursementId { get; set; }

        [Required]
        public int ClaimId { get; set; }

        [Required]
        public int ProcessedBy { get; set; }

        [Required]
        public string PaymentMethod { get; set; } 

        public string TransactionReference { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string Status { get; set; } = "Processed";

        public DateTime PaymentDate { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual Claim Claim { get; set; }
        public virtual User ProcessedByUser { get; set; }
    }
}
