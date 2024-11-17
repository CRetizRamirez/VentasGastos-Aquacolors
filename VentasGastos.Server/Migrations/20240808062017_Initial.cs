using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VentasGastos.Server.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ConceptosA",
                columns: table => new
                {
                    idConcepto = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Concepto = table.Column<string>(type: "varchar(32)", unicode: false, maxLength: 32, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Concepto__25A881FD8140AE57", x => x.idConcepto);
                });

            migrationBuilder.CreateTable(
                name: "EmpleadosA",
                columns: table => new
                {
                    idEmpleado = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Empleado = table.Column<string>(type: "varchar(32)", unicode: false, maxLength: 32, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Empleado__5295297C0EB72827", x => x.idEmpleado);
                });

            migrationBuilder.CreateTable(
                name: "FormasDePagoA",
                columns: table => new
                {
                    idFormaDePago = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FormaDePago = table.Column<string>(type: "varchar(32)", unicode: false, maxLength: 32, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__FormaDeP__BD478E803D4B55A7", x => x.idFormaDePago);
                });

            migrationBuilder.CreateTable(
                name: "GastosA",
                columns: table => new
                {
                    idGasto = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: true),
                    Monto = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    F = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    S = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    R = table.Column<int>(type: "int", nullable: false),
                    Comentario = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    MarcaTemporal = table.Column<DateTime>(type: "datetime", nullable: true),
                    Concepto = table.Column<string>(type: "varchar(32)", unicode: false, maxLength: 32, nullable: true),
                    Tienda = table.Column<string>(type: "varchar(32)", unicode: false, maxLength: 32, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__GastosA__F25CC3217798245C", x => x.idGasto);
                });

            migrationBuilder.CreateTable(
                name: "TiendasA",
                columns: table => new
                {
                    idTienda = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tienda = table.Column<string>(type: "varchar(32)", unicode: false, maxLength: 32, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TiendasA__AD83A8B22C47CB82", x => x.idTienda);
                });

            migrationBuilder.CreateTable(
                name: "VendedoresA",
                columns: table => new
                {
                    idVendedor = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vendedor = table.Column<string>(type: "varchar(32)", unicode: false, maxLength: 32, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Vendedor__32CB9A0373572F68", x => x.idVendedor);
                });

            migrationBuilder.CreateTable(
                name: "VentasA",
                columns: table => new
                {
                    idVenta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: true),
                    Tienda = table.Column<string>(type: "varchar(32)", unicode: false, maxLength: 32, nullable: true),
                    Vendedor = table.Column<string>(type: "varchar(32)", unicode: false, maxLength: 32, nullable: true),
                    Nota = table.Column<int>(type: "int", nullable: true),
                    Monto = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    FormaDePago = table.Column<string>(type: "varchar(32)", unicode: false, maxLength: 32, nullable: true),
                    Comentario = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    MarcaTemporal = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__VentasA__077D5614886416B4", x => x.idVenta);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConceptosA");

            migrationBuilder.DropTable(
                name: "EmpleadosA");

            migrationBuilder.DropTable(
                name: "FormasDePagoA");

            migrationBuilder.DropTable(
                name: "GastosA");

            migrationBuilder.DropTable(
                name: "TiendasA");

            migrationBuilder.DropTable(
                name: "VendedoresA");

            migrationBuilder.DropTable(
                name: "VentasA");
        }
    }
}
