using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactProjectAPI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class lastone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "MaxAmount",
                table: "ExpenseCategories",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "MinAmount",
                table: "ExpenseCategories",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.UpdateData(
                table: "ExpenseCategories",
                keyColumn: "CategoryId",
                keyValue: 1,
                columns: new[] { "MaxAmount", "MinAmount" },
                values: new object[] { 10000m, 500m });

            migrationBuilder.UpdateData(
                table: "ExpenseCategories",
                keyColumn: "CategoryId",
                keyValue: 2,
                columns: new[] { "MaxAmount", "MinAmount" },
                values: new object[] { 2000m, 100m });

            migrationBuilder.UpdateData(
                table: "ExpenseCategories",
                keyColumn: "CategoryId",
                keyValue: 3,
                columns: new[] { "MaxAmount", "MinAmount" },
                values: new object[] { 5000m, 50m });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxAmount",
                table: "ExpenseCategories");

            migrationBuilder.DropColumn(
                name: "MinAmount",
                table: "ExpenseCategories");
        }
    }
}
