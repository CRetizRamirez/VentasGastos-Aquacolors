using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace VentasGastos.Server.Models;

public partial class DbVentasGastosAContext : DbContext
{
    public DbVentasGastosAContext()
    {
    }

    public DbVentasGastosAContext(DbContextOptions<DbVentasGastosAContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ConceptosA> ConceptosAs { get; set; }

    public virtual DbSet<EmpleadosA> EmpleadosAs { get; set; }

    public virtual DbSet<FormasDePagoA> FormasDePagoAs { get; set; }

    public virtual DbSet<GastosA> GastosAs { get; set; }

    public virtual DbSet<TiendasA> TiendasAs { get; set; }

    public virtual DbSet<VendedoresA> VendedoresAs { get; set; }

    public virtual DbSet<VentasA> VentasAs { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ConceptosA>(entity =>
        {
            entity.HasKey(e => e.IdConcepto).HasName("PK__Concepto__25A881FD8140AE57");

            entity.ToTable("ConceptosA");

            entity.Property(e => e.IdConcepto).HasColumnName("idConcepto");
            entity.Property(e => e.Concepto)
                .HasMaxLength(32)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EmpleadosA>(entity =>
        {
            entity.HasKey(e => e.IdEmpleado).HasName("PK__Empleado__5295297C0EB72827");

            entity.ToTable("EmpleadosA");

            entity.Property(e => e.IdEmpleado).HasColumnName("idEmpleado");
            entity.Property(e => e.Empleado)
                .HasMaxLength(32)
                .IsUnicode(false);
        });

        modelBuilder.Entity<FormasDePagoA>(entity =>
        {
            entity.HasKey(e => e.IdFormaDePago).HasName("PK__FormaDeP__BD478E803D4B55A7");

            entity.ToTable("FormasDePagoA");

            entity.Property(e => e.IdFormaDePago).HasColumnName("idFormaDePago");
            entity.Property(e => e.FormaDePago)
                .HasMaxLength(32)
                .IsUnicode(false);
        });

        modelBuilder.Entity<GastosA>(entity =>
        {
            entity.HasKey(e => e.IdGasto).HasName("PK__GastosA__F25CC3217798245C");

            entity.ToTable("GastosA");

            entity.Property(e => e.IdGasto).HasColumnName("idGasto");
            entity.Property(e => e.Comentario)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Concepto)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.F).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.MarcaTemporal).HasColumnType("datetime");
            entity.Property(e => e.Monto).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.S).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Tienda)
                .HasMaxLength(32)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TiendasA>(entity =>
        {
            entity.HasKey(e => e.IdTienda).HasName("PK__TiendasA__AD83A8B22C47CB82");

            entity.ToTable("TiendasA");

            entity.Property(e => e.IdTienda).HasColumnName("idTienda");
            entity.Property(e => e.Tienda)
                .HasMaxLength(32)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VendedoresA>(entity =>
        {
            entity.HasKey(e => e.IdVendedor).HasName("PK__Vendedor__32CB9A0373572F68");

            entity.ToTable("VendedoresA");

            entity.Property(e => e.IdVendedor).HasColumnName("idVendedor");
            entity.Property(e => e.Vendedor)
                .HasMaxLength(32)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VentasA>(entity =>
        {
            entity.HasKey(e => e.IdVenta).HasName("PK__VentasA__077D5614886416B4");

            entity.ToTable("VentasA");

            entity.Property(e => e.IdVenta).HasColumnName("idVenta");
            entity.Property(e => e.Comentario)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FormaDePago)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.MarcaTemporal).HasColumnType("datetime");
            entity.Property(e => e.Monto).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Tienda)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Vendedor)
                .HasMaxLength(32)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
