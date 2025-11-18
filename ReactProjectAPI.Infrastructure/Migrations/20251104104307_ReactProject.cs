using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ReactProjectAPI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ReactProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    DepartmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DepartmentName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.DepartmentId);
                });

            migrationBuilder.CreateTable(
                name: "ExpenseCategories",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExpenseCategories", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    DepartmentId = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Users_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "DepartmentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Claims",
                columns: table => new
                {
                    ClaimId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ExpenseDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReceiptImage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubmittedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Claims", x => x.ClaimId);
                    table.ForeignKey(
                        name: "FK_Claims_ExpenseCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "ExpenseCategories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Claims_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Approvals",
                columns: table => new
                {
                    ApprovalId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClaimId = table.Column<int>(type: "int", nullable: false),
                    ApprovedBy = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Comments = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ApprovalDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Approvals", x => x.ApprovalId);
                    table.ForeignKey(
                        name: "FK_Approvals_Claims_ClaimId",
                        column: x => x.ClaimId,
                        principalTable: "Claims",
                        principalColumn: "ClaimId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Approvals_Users_ApprovedBy",
                        column: x => x.ApprovedBy,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Reimbursements",
                columns: table => new
                {
                    ReimbursementId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClaimId = table.Column<int>(type: "int", nullable: false),
                    ProcessedBy = table.Column<int>(type: "int", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TransactionReference = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reimbursements", x => x.ReimbursementId);
                    table.ForeignKey(
                        name: "FK_Reimbursements_Claims_ClaimId",
                        column: x => x.ClaimId,
                        principalTable: "Claims",
                        principalColumn: "ClaimId");
                    table.ForeignKey(
                        name: "FK_Reimbursements_Users_ProcessedBy",
                        column: x => x.ProcessedBy,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.InsertData(
                table: "Departments",
                columns: new[] { "DepartmentId", "DepartmentName", "Description" },
                values: new object[,]
                {
                    { 1, "IT", "Information Technology" },
                    { 2, "Finance", "Finance Department" },
                    { 3, "HR", "Human Resources" }
                });

            migrationBuilder.InsertData(
                table: "ExpenseCategories",
                columns: new[] { "CategoryId", "CategoryName", "Description" },
                values: new object[,]
                {
                    { 1, "Travel", "Travel related expenses" },
                    { 2, "Meals", "Food and dining expenses" },
                    { 3, "Office Supplies", "Office equipment and supplies" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "CreatedDate", "DepartmentId", "Email", "Name", "Password", "Role" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "finance@gmail.com", "Jagadish", "Finance123", 3 },
                    { 2, new DateTime(2024, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "manager@gmail.com", "Gokul", "Manager123", 2 },
                    { 3, new DateTime(2024, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "employee@gmail.com", "Lavan", "Employee123", 1 }
                });

            migrationBuilder.InsertData(
                table: "Claims",
                columns: new[] { "ClaimId", "Amount", "CategoryId", "Description", "ExpenseDate", "ReceiptImage", "Status", "SubmittedDate", "Title", "UserId" },
                values: new object[,]
                {
                    { 1, 4500m, 1, "Travel expenses for client meeting at Hyderabad.", new DateTime(2024, 10, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "receipts/travel1.jpg", "Submitted", new DateTime(2024, 10, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Client Visit Travel", 3 },
                    { 2, 1800m, 2, "Lunch with team after project delivery.", new DateTime(2024, 10, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "receipts/food1.jpg", "Approved", new DateTime(2024, 10, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), "Team Lunch", 3 }
                });

            migrationBuilder.InsertData(
                table: "Approvals",
                columns: new[] { "ApprovalId", "ApprovalDate", "ApprovedBy", "ClaimId", "Comments", "Status" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 10, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 1, "Valid expense, approved.", "Approved" },
                    { 2, new DateTime(2024, 10, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 2, "Bill not clear, rejected.", "Rejected" }
                });

            migrationBuilder.InsertData(
                table: "Reimbursements",
                columns: new[] { "ReimbursementId", "Amount", "ClaimId", "PaymentDate", "PaymentMethod", "ProcessedBy", "Status", "TransactionReference" },
                values: new object[,]
                {
                    { 1, 1800m, 2, new DateTime(2024, 10, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), "Bank Transfer", 1, "Paid", "TXN001" },
                    { 2, 4500m, 1, new DateTime(2024, 10, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "Bank Transfer", 1, "Paid", "TXN002" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Approvals_ApprovedBy",
                table: "Approvals",
                column: "ApprovedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Approvals_ClaimId",
                table: "Approvals",
                column: "ClaimId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Claims_CategoryId",
                table: "Claims",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Claims_UserId",
                table: "Claims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Reimbursements_ClaimId",
                table: "Reimbursements",
                column: "ClaimId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reimbursements_ProcessedBy",
                table: "Reimbursements",
                column: "ProcessedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Users_DepartmentId",
                table: "Users",
                column: "DepartmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Approvals");

            migrationBuilder.DropTable(
                name: "Reimbursements");

            migrationBuilder.DropTable(
                name: "Claims");

            migrationBuilder.DropTable(
                name: "ExpenseCategories");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Departments");
        }
    }
}
