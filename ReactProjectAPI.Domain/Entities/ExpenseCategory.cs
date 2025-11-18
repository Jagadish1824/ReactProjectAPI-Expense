using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReactProjectAPI.Domain.Entities
{
    public class ExpenseCategory
    {
        [Key]
        public int CategoryId { get; set; }

        [Required, StringLength(100)]
        public string CategoryName { get; set; }

        public string Description { get; set; }

        [Required]
        public decimal MinAmount { get; set; }

        [Required]
        public decimal MaxAmount { get; set; }

        // Navigation property
        public virtual ICollection<Claim> Claims { get; set; }
    }
}
