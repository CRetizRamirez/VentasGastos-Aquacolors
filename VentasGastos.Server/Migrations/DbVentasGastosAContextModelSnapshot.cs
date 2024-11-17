﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using VentasGastos.Server.Models;

#nullable disable

namespace VentasGastos.Server.Migrations
{
    [DbContext(typeof(DbVentasGastosAContext))]
    partial class DbVentasGastosAContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("VentasGastos.Server.Models.ConceptosA", b =>
                {
                    b.Property<int>("IdConcepto")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("idConcepto");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdConcepto"));

                    b.Property<string>("Concepto")
                        .HasMaxLength(32)
                        .IsUnicode(false)
                        .HasColumnType("varchar(32)");

                    b.HasKey("IdConcepto")
                        .HasName("PK__Concepto__25A881FD8140AE57");

                    b.ToTable("ConceptosA", (string)null);
                });

            modelBuilder.Entity("VentasGastos.Server.Models.EmpleadosA", b =>
                {
                    b.Property<int>("IdEmpleado")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("idEmpleado");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdEmpleado"));

                    b.Property<string>("Empleado")
                        .HasMaxLength(32)
                        .IsUnicode(false)
                        .HasColumnType("varchar(32)");

                    b.HasKey("IdEmpleado")
                        .HasName("PK__Empleado__5295297C0EB72827");

                    b.ToTable("EmpleadosA", (string)null);
                });

            modelBuilder.Entity("VentasGastos.Server.Models.FormasDePagoA", b =>
                {
                    b.Property<int>("IdFormaDePago")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("idFormaDePago");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdFormaDePago"));

                    b.Property<string>("FormaDePago")
                        .HasMaxLength(32)
                        .IsUnicode(false)
                        .HasColumnType("varchar(32)");

                    b.HasKey("IdFormaDePago")
                        .HasName("PK__FormaDeP__BD478E803D4B55A7");

                    b.ToTable("FormasDePagoA", (string)null);
                });

            modelBuilder.Entity("VentasGastos.Server.Models.GastosA", b =>
                {
                    b.Property<int>("IdGasto")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("idGasto");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdGasto"));

                    b.Property<string>("Comentario")
                        .HasMaxLength(100)
                        .IsUnicode(false)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("Concepto")
                        .HasMaxLength(32)
                        .IsUnicode(false)
                        .HasColumnType("varchar(32)");

                    b.Property<decimal>("F")
                        .HasColumnType("decimal(10, 2)");

                    b.Property<DateOnly?>("Fecha")
                        .HasColumnType("date");

                    b.Property<DateTime?>("MarcaTemporal")
                        .HasColumnType("datetime");

                    b.Property<decimal>("Monto")
                        .HasColumnType("decimal(10, 2)");

                    b.Property<int>("R")
                        .HasColumnType("int");

                    b.Property<decimal>("S")
                        .HasColumnType("decimal(10, 2)");

                    b.Property<string>("Tienda")
                        .HasMaxLength(32)
                        .IsUnicode(false)
                        .HasColumnType("varchar(32)");

                    b.HasKey("IdGasto")
                        .HasName("PK__GastosA__F25CC3217798245C");

                    b.ToTable("GastosA", (string)null);
                });

            modelBuilder.Entity("VentasGastos.Server.Models.TiendasA", b =>
                {
                    b.Property<int>("IdTienda")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("idTienda");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdTienda"));

                    b.Property<string>("Tienda")
                        .HasMaxLength(32)
                        .IsUnicode(false)
                        .HasColumnType("varchar(32)");

                    b.HasKey("IdTienda")
                        .HasName("PK__TiendasA__AD83A8B22C47CB82");

                    b.ToTable("TiendasA", (string)null);
                });

            modelBuilder.Entity("VentasGastos.Server.Models.VendedoresA", b =>
                {
                    b.Property<int>("IdVendedor")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("idVendedor");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdVendedor"));

                    b.Property<string>("Vendedor")
                        .HasMaxLength(32)
                        .IsUnicode(false)
                        .HasColumnType("varchar(32)");

                    b.HasKey("IdVendedor")
                        .HasName("PK__Vendedor__32CB9A0373572F68");

                    b.ToTable("VendedoresA", (string)null);
                });

            modelBuilder.Entity("VentasGastos.Server.Models.VentasA", b =>
                {
                    b.Property<int>("IdVenta")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("idVenta");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdVenta"));

                    b.Property<string>("Comentario")
                        .HasMaxLength(100)
                        .IsUnicode(false)
                        .HasColumnType("varchar(100)");

                    b.Property<DateOnly?>("Fecha")
                        .HasColumnType("date");

                    b.Property<string>("FormaDePago")
                        .HasMaxLength(32)
                        .IsUnicode(false)
                        .HasColumnType("varchar(32)");

                    b.Property<DateTime?>("MarcaTemporal")
                        .HasColumnType("datetime");

                    b.Property<decimal>("Monto")
                        .HasColumnType("decimal(10, 2)");

                    b.Property<int?>("Nota")
                        .HasColumnType("int");

                    b.Property<string>("Tienda")
                        .HasMaxLength(32)
                        .IsUnicode(false)
                        .HasColumnType("varchar(32)");

                    b.Property<string>("Vendedor")
                        .HasMaxLength(32)
                        .IsUnicode(false)
                        .HasColumnType("varchar(32)");

                    b.HasKey("IdVenta")
                        .HasName("PK__VentasA__077D5614886416B4");

                    b.ToTable("VentasA", (string)null);
                });
#pragma warning restore 612, 618
        }
    }
}
