using System;
using System.Collections.Generic;

namespace VentasGastos.Server.Models;

public partial class GastosA
{
    public int IdGasto { get; set; }

    public DateOnly? Fecha { get; set; }

    public decimal Monto { get; set; }

    public decimal F { get; set; }

    public decimal S { get; set; }

    public int R { get; set; }

    public string? Comentario { get; set; }

    public DateTime? MarcaTemporal { get; set; }

    public string? Concepto { get; set; }

    public string? Tienda { get; set; }
}
