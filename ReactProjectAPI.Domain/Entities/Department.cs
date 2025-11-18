using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReactProjectAPI.Domain.Entities
{
    public class Department
    {
        [Key]
        public int DepartmentId { get; set; }

        [Required, StringLength(100)]
        public string DepartmentName { get; set; }

        public string Description { get; set; }

        // Navigation property
        public virtual ICollection<User> Users { get; set; }
    }
}
