using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class ChangeInOrderToServicePriceRelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderToServicePrices");

            migrationBuilder.CreateTable(
                name: "OrderServicePrice",
                columns: table => new
                {
                    OrdersOrderId = table.Column<int>(type: "INTEGER", nullable: false),
                    ServicePricesId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderServicePrice", x => new { x.OrdersOrderId, x.ServicePricesId });
                    table.ForeignKey(
                        name: "FK_OrderServicePrice_Orders_OrdersOrderId",
                        column: x => x.OrdersOrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderServicePrice_ServicePrices_ServicePricesId",
                        column: x => x.ServicePricesId,
                        principalTable: "ServicePrices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderServicePrice_ServicePricesId",
                table: "OrderServicePrice",
                column: "ServicePricesId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderServicePrice");

            migrationBuilder.CreateTable(
                name: "OrderToServicePrices",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "INTEGER", nullable: false),
                    ServicePriceId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderToServicePrices", x => new { x.OrderId, x.ServicePriceId });
                    table.ForeignKey(
                        name: "FK_OrderToServicePrices_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderToServicePrices_ServicePrices_ServicePriceId",
                        column: x => x.ServicePriceId,
                        principalTable: "ServicePrices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderToServicePrices_ServicePriceId",
                table: "OrderToServicePrices",
                column: "ServicePriceId");
        }
    }
}
