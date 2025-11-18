using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReactProjectAPI.Domain.Entities
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required, StringLength(100)]
        public string Name { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public UserRole Role { get; set; }

        // 🔹 Foreign Key for Department
        [Required]
        public int DepartmentId { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // 🔹 Navigation property
        public virtual Department Department { get; set; }
        public virtual ICollection<Claim> Claims { get; set; }
        public virtual ICollection<Approval> Approvals { get; set; }
        public virtual ICollection<Reimbursement> Reimbursements { get; set; }
    }
}
