using Microsoft.EntityFrameworkCore;
using ReactProjectAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactProjectAPI.Infrastructure.Data
{
    public class ReactProjectAPIContext : DbContext
    {
        public ReactProjectAPIContext(DbContextOptions<ReactProjectAPIContext> options) : base(options)
        {

        }
        public DbSet<Approval> Approvals { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Claim> Claims { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<ExpenseCategory> ExpenseCategories { get; set; }
        public DbSet<Reimbursement> Reimbursements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            
            modelBuilder.Entity<User>()
                .HasOne(u => u.Department)
                .WithMany(d => d.Users)
                .HasForeignKey(u => u.DepartmentId);

            
            modelBuilder.Entity<Claim>()
                .HasOne(c => c.User)
                .WithMany(u => u.Claims)
                .HasForeignKey(c => c.UserId);

            modelBuilder.Entity<Claim>()
                .HasOne(c => c.Category)
                .WithMany(cat => cat.Claims)
                .HasForeignKey(c => c.CategoryId);

            modelBuilder.Entity<Approval>()
                .HasOne(a => a.Claim)
                .WithOne(c => c.Approval)
                .HasForeignKey<Approval>(a => a.ClaimId);

            modelBuilder.Entity<Approval>()
                .HasOne(a => a.ApprovedByUser)
                .WithMany(u => u.Approvals)
                .HasForeignKey(a => a.ApprovedBy)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Reimbursement>()
                .HasOne(r => r.Claim)
                .WithOne(c => c.Reimbursement)
                .HasForeignKey<Reimbursement>(r => r.ClaimId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Reimbursement>()
                .HasOne(r => r.ProcessedByUser)
                .WithMany(u => u.Reimbursements)
                .HasForeignKey(r => r.ProcessedBy)
                .OnDelete(DeleteBehavior.NoAction);

            //  Seed Departments
            modelBuilder.Entity<Department>().HasData(
                new Department { DepartmentId = 1, DepartmentName = "IT", Description = "Information Technology" },
                new Department { DepartmentId = 2, DepartmentName = "Finance", Description = "Finance Department" },
                new Department { DepartmentId = 3, DepartmentName = "HR", Description = "Human Resources" }
            );

            // Seed Users (with DepartmentId)
            modelBuilder.Entity<User>().HasData(
                new User { UserId = 1, Name = "Jagadish", Email = "finance@gmail.com", Password = "Finance123", Role = UserRole.Finance, DepartmentId = 2, CreatedDate = new DateTime(2024, 1, 1) },
                new User { UserId = 2, Name = "Gokul", Email = "manager@gmail.com", Password = "Manager123", Role = UserRole.Manager, DepartmentId = 1, CreatedDate = new DateTime(2024, 1, 5) },
                new User { UserId = 3, Name = "Lavan", Email = "employee@gmail.com", Password = "Employee123", Role = UserRole.Employee, DepartmentId = 1, CreatedDate = new DateTime(2024, 1, 10) }
            );

            // Seed Expense Categories
            modelBuilder.Entity<ExpenseCategory>().HasData(
                new ExpenseCategory { CategoryId = 1, CategoryName = "Travel", Description = "Travel related expenses", MinAmount = 100, MaxAmount = 10000 },
                new ExpenseCategory { CategoryId = 2, CategoryName = "Meals", Description = "Food and dining expenses", MinAmount = 50, MaxAmount = 2000 },
                new ExpenseCategory { CategoryId = 3, CategoryName = "Office Supplies", Description = "Office equipment and supplies", MinAmount = 25, MaxAmount = 5000 }
            );

            // Seed Claims
            modelBuilder.Entity<Claim>().HasData(
                new Claim { ClaimId = 1, UserId = 3, Title = "Client Visit Travel", Description = "Travel expenses for client meeting at Hyderabad.", CategoryId = 1, Amount = 4500, ExpenseDate = new DateTime(2024, 10, 10), ReceiptImage = "receipts/travel1.jpg", Status = "Paid", SubmittedDate = new DateTime(2024, 10, 11), Comments = "Valid expense, approved." },
                new Claim { ClaimId = 2, UserId = 3, Title = "Team Lunch", Description = "Lunch with team after project delivery.", CategoryId = 2, Amount = 1800, ExpenseDate = new DateTime(2024, 10, 18), ReceiptImage = "receipts/food1.jpg", Status = "Rejected", SubmittedDate = new DateTime(2024, 10, 19), Comments = "Bill not clear, rejected." },
                new Claim { ClaimId = 5, UserId = 3, Title = "Office Supplies", Description = "Laptop and accessories for work.", CategoryId = 3, Amount = 2500, ExpenseDate = new DateTime(2024, 11, 1), ReceiptImage = "receipts/office1.jpg", Status = "Approved", SubmittedDate = new DateTime(2024, 11, 2), Comments = "Office supplies approved." }
            );

            //  Seed Approvals
            modelBuilder.Entity<Approval>().HasData(
                new Approval { ApprovalId = 1, ClaimId = 1, ApprovedBy = 2, Status = "Approved", Comments = "Valid expense, approved.", ApprovalDate = new DateTime(2024, 10, 20) },
                new Approval { ApprovalId = 2, ClaimId = 2, ApprovedBy = 2, Status = "Rejected", Comments = "Bill not clear, rejected.", ApprovalDate = new DateTime(2024, 10, 25) },
                new Approval { ApprovalId = 3, ClaimId = 5, ApprovedBy = 2, Status = "Approved", Comments = "Office supplies approved.", ApprovalDate = new DateTime(2024, 11, 3) }
            );

            //  Seed Reimbursements
            modelBuilder.Entity<Reimbursement>().HasData(
                new Reimbursement { ReimbursementId = 1, ClaimId = 1, ProcessedBy = 1, PaymentMethod = "Bank Transfer", TransactionReference = "TXN002", Amount = 4500, Status = "Paid", PaymentDate = new DateTime(2024, 10, 21) }
            );
        }

    }
}
