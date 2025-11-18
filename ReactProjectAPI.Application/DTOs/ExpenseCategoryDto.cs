using System.ComponentModel.DataAnnotations;

namespace ReactProjectAPI.Application.DTOs
{
    public class ExpenseCategoryDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string Description { get; set; }
        public decimal MinAmount { get; set; }
        public decimal MaxAmount { get; set; }
    }

    public class CreateExpenseCategoryDto
    {
        [Required(ErrorMessage = "Category name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Category name must be between 2 and 100 characters")]
        public string CategoryName { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Minimum amount is required")]
        [Range(0.01, 999999.99, ErrorMessage = "Minimum amount must be between 0.01 and 999,999.99")]
        public decimal MinAmount { get; set; }

        [Required(ErrorMessage = "Maximum amount is required")]
        [Range(0.01, 999999.99, ErrorMessage = "Maximum amount must be between 0.01 and 999,999.99")]
        public decimal MaxAmount { get; set; }
    }

    public class UpdateExpenseCategoryDto
    {
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Category name must be between 2 and 100 characters")]
        public string CategoryName { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; }
    }
}