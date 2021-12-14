using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class MissingMigrationAddedAfterWiktorPullRequest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_OrderToServicePrices_ServicePriceId",
                table: "OrderToServicePrices",
                column: "ServicePriceId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderToServicePrices_Orders_OrderId",
                table: "OrderToServicePrices",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderToServicePrices_ServicePrices_ServicePriceId",
                table: "OrderToServicePrices",
                column: "ServicePriceId",
                principalTable: "ServicePrices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderToServicePrices_Orders_OrderId",
                table: "OrderToServicePrices");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderToServicePrices_ServicePrices_ServicePriceId",
                table: "OrderToServicePrices");

            migrationBuilder.DropIndex(
                name: "IX_OrderToServicePrices_ServicePriceId",
                table: "OrderToServicePrices");
        }
    }
}
