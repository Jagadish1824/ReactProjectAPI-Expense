using System.ComponentModel.DataAnnotations;

namespace ReactProjectAPI.Application.DTOs
{
    public class ReimbursementDto
    {
        public int ReimbursementId { get; set; }
        public int ClaimId { get; set; }
        public string ClaimTitle { get; set; }
        public int ProcessedBy { get; set; }
        public string ProcessedByName { get; set; }
        public string PaymentMethod { get; set; }
        public string TransactionReference { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public DateTime PaymentDate { get; set; }
    }

    public class CreateReimbursementDto
    {
        [Required(ErrorMessage = "Claim ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Please select a valid claim")]
        public int ClaimId { get; set; }

        [Required(ErrorMessage = "Payment method is required")]
        [RegularExpression("^(Bank Transfer|UPI|Check)$", ErrorMessage = "Payment method must be Bank Transfer, UPI, or Check")]
        public string PaymentMethod { get; set; }

        [Required(ErrorMessage = "Transaction reference is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Transaction reference must be between 3 and 100 characters")]
        [RegularExpression(@"^[A-Z0-9]+$", ErrorMessage = "Transaction reference must contain only uppercase letters and numbers")]
        public string TransactionReference { get; set; }

        [Required(ErrorMessage = "Amount is required")]
        [Range(0.01, 999999.99, ErrorMessage = "Amount must be between 0.01 and 999,999.99")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Status is required")]
        [RegularExpression("^(Processed|Paid|Failed|Cancelled)$", ErrorMessage = "Status must be Processed, Paid, Failed, or Cancelled")]
        public string Status { get; set; }
    }

    public class UpdateReimbursementDto
    {
        [RegularExpression("^(Bank Transfer|UPI|Check)$", ErrorMessage = "Payment method must be Bank Transfer, UPI, or Check")]
        public string PaymentMethod { get; set; }

        [StringLength(100, MinimumLength = 3, ErrorMessage = "Transaction reference must be between 3 and 100 characters")]
        [RegularExpression(@"^[A-Z0-9]+$", ErrorMessage = "Transaction reference must contain only uppercase letters and numbers")]
        public string TransactionReference { get; set; }

        [Range(0.01, 999999.99, ErrorMessage = "Amount must be between 0.01 and 999,999.99")]
        public decimal? Amount { get; set; }

        [RegularExpression("^(Processed|Paid|Failed|Cancelled)$", ErrorMessage = "Status must be Processed, Paid, Failed, or Cancelled")]
        public string Status { get; set; }
    }
}