using System;
using System.Collections.Generic;

namespace VentasGastos.Server.Models;

public partial class VentasA
{
    public int IdVenta { get; set; }

    public DateOnly? Fecha { get; set; }

    public string? Tienda { get; set; }

    public string? Vendedor { get; set; }

    public int? Nota { get; set; }

    public decimal Monto { get; set; }

    public string? FormaDePago { get; set; }

    public string? Comentario { get; set; }

    public DateTime? MarcaTemporal { get; set; }
}
