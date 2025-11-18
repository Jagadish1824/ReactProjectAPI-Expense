using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactProjectAPI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class finalmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Claims",
                keyColumn: "ClaimId",
                keyValue: 1,
                column: "Status",
                value: "Approved");

            migrationBuilder.UpdateData(
                table: "Claims",
                keyColumn: "ClaimId",
                keyValue: 2,
                column: "Status",
                value: "Rejected");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Claims",
                keyColumn: "ClaimId",
                keyValue: 1,
                column: "Status",
                value: "Submitted");

            migrationBuilder.UpdateData(
                table: "Claims",
                keyColumn: "ClaimId",
                keyValue: 2,
                column: "Status",
                value: "Approved");
        }
    }
}
