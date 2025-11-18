using System.ComponentModel.DataAnnotations;

namespace ReactProjectAPI.Application.DTOs
{
    public class ClaimDto
    {
        public int ClaimId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public decimal Amount { get; set; }
        public DateTime ExpenseDate { get; set; }
        public string ReceiptImage { get; set; }
        public string Status { get; set; }
        public DateTime SubmittedDate { get; set; }
        public string Comments { get; set; }
    }

    public class CreateClaimDto
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "Title must be between 5 and 200 characters")]
        public string Title { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Category is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Please select a valid category")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Amount is required")]
        [Range(0.01, 999999.99, ErrorMessage = "Amount must be between 0.01 and 999,999.99")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Expense date is required")]
        [DataType(DataType.Date)]
        public DateTime ExpenseDate { get; set; }

        [StringLength(500, ErrorMessage = "Receipt image path cannot exceed 500 characters")]
        [RegularExpression(@"^.*\.(jpg|jpeg|png|gif|bmp|webp)$", ErrorMessage = "Only image files are allowed (jpg, jpeg, png, gif, bmp, webp)")]
        public string ReceiptImage { get; set; }

        [StringLength(1000, ErrorMessage = "Comments cannot exceed 1000 characters")]
        public string Comments { get; set; }
    }

    public class UpdateClaimDto
    {
        [StringLength(200, MinimumLength = 5, ErrorMessage = "Title must be between 5 and 200 characters")]
        public string Title { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string Description { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Please select a valid category")]
        public int? CategoryId { get; set; }

        [Range(0.01, 999999.99, ErrorMessage = "Amount must be between 0.01 and 999,999.99")]
        public decimal? Amount { get; set; }

        [DataType(DataType.Date)]
        public DateTime? ExpenseDate { get; set; }

        [StringLength(500, ErrorMessage = "Receipt image path cannot exceed 500 characters")]
        [RegularExpression(@"^.*\.(jpg|jpeg|png|gif|bmp|webp)$", ErrorMessage = "Only image files are allowed (jpg, jpeg, png, gif, bmp, webp)")]
        public string ReceiptImage { get; set; }

        [StringLength(1000, ErrorMessage = "Comments cannot exceed 1000 characters")]
        public string Comments { get; set; }
    }
}