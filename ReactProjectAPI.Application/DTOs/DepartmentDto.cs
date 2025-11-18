using System.ComponentModel.DataAnnotations;

namespace ReactProjectAPI.Application.DTOs
{
    public class DepartmentDto
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public string Description { get; set; }
    }

    public class CreateDepartmentDto
    {
        [Required(ErrorMessage = "Department name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Department name must be between 2 and 100 characters")]
        public string DepartmentName { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; }
    }

    public class UpdateDepartmentDto
    {
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Department name must be between 2 and 100 characters")]
        public string DepartmentName { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; }
    }
}