using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactProjectAPI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class projectfinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Reimbursements",
                keyColumn: "ReimbursementId",
                keyValue: 2);

            migrationBuilder.AddColumn<string>(
                name: "Comments",
                table: "Claims",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Claims",
                keyColumn: "ClaimId",
                keyValue: 1,
                columns: new[] { "Comments", "Status" },
                values: new object[] { "Valid expense, approved.", "Paid" });

            migrationBuilder.UpdateData(
                table: "Claims",
                keyColumn: "ClaimId",
                keyValue: 2,
                column: "Comments",
                value: "Bill not clear, rejected.");

            migrationBuilder.InsertData(
                table: "Claims",
                columns: new[] { "ClaimId", "Amount", "CategoryId", "Comments", "Description", "ExpenseDate", "ReceiptImage", "Status", "SubmittedDate", "Title", "UserId" },
                values: new object[] { 5, 2500m, 3, "Office supplies approved.", "Laptop and accessories for work.", new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "receipts/office1.jpg", "Approved", new DateTime(2024, 11, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Office Supplies", 3 });

            migrationBuilder.UpdateData(
                table: "Reimbursements",
                keyColumn: "ReimbursementId",
                keyValue: 1,
                columns: new[] { "Amount", "ClaimId", "PaymentDate", "TransactionReference" },
                values: new object[] { 4500m, 1, new DateTime(2024, 10, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "TXN002" });

            migrationBuilder.InsertData(
                table: "Approvals",
                columns: new[] { "ApprovalId", "ApprovalDate", "ApprovedBy", "ClaimId", "Comments", "Status" },
                values: new object[] { 3, new DateTime(2024, 11, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 5, "Office supplies approved.", "Approved" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Approvals",
                keyColumn: "ApprovalId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Claims",
                keyColumn: "ClaimId",
                keyValue: 5);

            migrationBuilder.DropColumn(
                name: "Comments",
                table: "Claims");

            migrationBuilder.UpdateData(
                table: "Claims",
                keyColumn: "ClaimId",
                keyValue: 1,
                column: "Status",
                value: "Approved");

            migrationBuilder.UpdateData(
                table: "Reimbursements",
                keyColumn: "ReimbursementId",
                keyValue: 1,
                columns: new[] { "Amount", "ClaimId", "PaymentDate", "TransactionReference" },
                values: new object[] { 1800m, 2, new DateTime(2024, 10, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), "TXN001" });

            migrationBuilder.InsertData(
                table: "Reimbursements",
                columns: new[] { "ReimbursementId", "Amount", "ClaimId", "PaymentDate", "PaymentMethod", "ProcessedBy", "Status", "TransactionReference" },
                values: new object[] { 2, 4500m, 1, new DateTime(2024, 10, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "Bank Transfer", 1, "Paid", "TXN002" });
        }
    }
}
