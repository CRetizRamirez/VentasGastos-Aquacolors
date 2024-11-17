using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using VentasGastos.Server.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace VentasGastos.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SPController(DbVentasGastosAContext context) : ControllerBase
    {
        private readonly DbVentasGastosAContext _context = context;

        [HttpGet("Mostrar5Ventas")]
        public IActionResult Mostrar5Ventas()
        {
            try
            {
                List<VentasA> ventas = [];

                using (var conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using var comando = conexion.CreateCommand();
                    comando.CommandType = System.Data.CommandType.StoredProcedure;
                    comando.CommandText = "usp_Mostrar5Ventas";

                    conexion.Open();
                    using SqlDataReader reader = comando.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            ventas.Add(new VentasA
                            {
                                IdVenta = reader.GetInt32(reader.GetOrdinal("idVenta")),
                                Fecha = DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("Fecha"))),
                                Tienda = reader.GetString(reader.GetOrdinal("Tienda")),
                                Vendedor = reader.GetString(reader.GetOrdinal("Vendedor")),
                                Nota = reader.GetInt32(reader.GetOrdinal("Nota")),
                                Monto = reader.GetDecimal(reader.GetOrdinal("Monto")),
                                FormaDePago = reader.GetString(reader.GetOrdinal("FormaDePago")),
                                Comentario = reader.IsDBNull(reader.GetOrdinal("Comentario")) ? null : reader.GetString(reader.GetOrdinal("Comentario")),
                                MarcaTemporal = reader.GetDateTime(reader.GetOrdinal("MarcaTemporal"))
                            });
                        }
                    }
                }

                return Ok(ventas);
            }
            catch (SqlException ex)
            {
                // Log the error
                return StatusCode(500, "Error de base de datos: " + ex.Message);
            }
            catch (Exception ex)
            {
                // Log the error
                return StatusCode(500, "Error inesperado: " + ex.Message);
            }
        }

        [HttpGet("Mostrar5Gastos")]
        public IActionResult Mostrar5Gastos()
        {
            try
            {
                List<GastosA> ventas = [];

                using (var conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using var comando = conexion.CreateCommand();
                    comando.CommandType = System.Data.CommandType.StoredProcedure;
                    comando.CommandText = "usp_Mostrar5Gastos";

                    conexion.Open();
                    using SqlDataReader reader = comando.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            ventas.Add(new GastosA
                            {
                                IdGasto = reader.GetInt32(reader.GetOrdinal("idGasto")),
                                Fecha = DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("Fecha"))),
                                Monto = reader.GetDecimal(reader.GetOrdinal("Monto")),
                                F = reader.GetDecimal(reader.GetOrdinal("F")),
                                S = reader.GetDecimal(reader.GetOrdinal("S")),
                                R = reader.GetInt32(reader.GetOrdinal("R")),
                                Comentario = reader.IsDBNull(reader.GetOrdinal("Comentario")) ? null : reader.GetString(reader.GetOrdinal("Comentario")),
                                MarcaTemporal = reader.GetDateTime(reader.GetOrdinal("MarcaTemporal")),
                                Concepto = reader.GetString(reader.GetOrdinal("Concepto")),
                                Tienda = reader.GetString(reader.GetOrdinal("Tienda"))
                            });
                        }
                    }
                }

                return Ok(ventas);
            }
            catch (SqlException ex)
            {
                // Log the error
                return StatusCode(500, "Error de base de datos: " + ex.Message);
            }
            catch (Exception ex)
            {
                // Log the error
                return StatusCode(500, "Error inesperado: " + ex.Message);
            }
        }

        [HttpPost("MostrarVentas")] //Muestra las ventas a partir de un rango de fechas
        public IActionResult MostrarVentas([FromBody] FechaRequest fechas)
        {
            try
            {
                if (fechas == null || fechas.FechaInicio == default || fechas.FechaFin == default)
                {
                    return BadRequest("Fechas no válidas.");
                }

                List<VentasA> ventas = new List<VentasA>();

                using (var conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using var comando = conexion.CreateCommand();
                    comando.CommandType = System.Data.CommandType.StoredProcedure;
                    comando.CommandText = "usp_MostrarVentas";

                    // Logging para depuración
                    Console.WriteLine($"FechaInicio: {fechas.FechaInicio}, FechaFin: {fechas.FechaFin}");

                    comando.Parameters.Add(new SqlParameter("@fechaInicio", fechas.FechaInicio));
                    comando.Parameters.Add(new SqlParameter("@fechaFin", fechas.FechaFin));

                    conexion.Open();
                    using SqlDataReader reader = comando.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            ventas.Add(new VentasA
                            {
                                IdVenta = reader.GetInt32(reader.GetOrdinal("idVenta")),
                                Fecha = DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("Fecha"))),
                                Tienda = reader.GetString(reader.GetOrdinal("Tienda")),
                                Vendedor = reader.GetString(reader.GetOrdinal("Vendedor")),
                                Nota = reader.GetInt32(reader.GetOrdinal("Nota")),
                                Monto = reader.GetDecimal(reader.GetOrdinal("Monto")),
                                FormaDePago = reader.GetString(reader.GetOrdinal("FormaDePago")),
                                Comentario = reader.IsDBNull(reader.GetOrdinal("Comentario")) ? null : reader.GetString(reader.GetOrdinal("Comentario")),
                                MarcaTemporal = reader.GetDateTime(reader.GetOrdinal("MarcaTemporal"))
                            });
                        }
                    }
                }

                return Ok(ventas);
            }
            catch (SqlException ex)
            {
                // Log the error
                return StatusCode(500, "Error de base de datos: " + ex.Message);
            }
            catch (Exception ex)
            {
                // Log the error
                return StatusCode(500, "Error inesperado: " + ex.Message);
            }
        }

        [HttpPost("MostrarGastos")] //Muestra las ventas a partir de un rango de fechas
        public IActionResult MostrarGastos([FromBody] FechaRequest fechas)
        {
            try
            {
                if (fechas == null || fechas.FechaInicio == default || fechas.FechaFin == default)
                {
                    return BadRequest("Fechas no válidas.");
                }

                List<GastosA> ventas = new List<GastosA>();

                using (var conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using var comando = conexion.CreateCommand();
                    comando.CommandType = System.Data.CommandType.StoredProcedure;
                    comando.CommandText = "usp_MostrarGastos";

                    // Logging para depuración
                    Console.WriteLine($"FechaInicio: {fechas.FechaInicio}, FechaFin: {fechas.FechaFin}");

                    comando.Parameters.Add(new SqlParameter("@fechaInicio", fechas.FechaInicio));
                    comando.Parameters.Add(new SqlParameter("@fechaFin", fechas.FechaFin));

                    conexion.Open();
                    using SqlDataReader reader = comando.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            ventas.Add(new GastosA
                            {
                                IdGasto = reader.GetInt32(reader.GetOrdinal("idGasto")),
                                Fecha = DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("Fecha"))),
                                Monto = reader.GetDecimal(reader.GetOrdinal("Monto")),
                                F = reader.GetDecimal(reader.GetOrdinal("F")),
                                S = reader.GetDecimal(reader.GetOrdinal("S")),
                                R = reader.GetInt32(reader.GetOrdinal("R")),
                                Comentario = reader.IsDBNull(reader.GetOrdinal("Comentario")) ? null : reader.GetString(reader.GetOrdinal("Comentario")),
                                MarcaTemporal = reader.GetDateTime(reader.GetOrdinal("MarcaTemporal")),
                                Concepto = reader.GetString(reader.GetOrdinal("Concepto")),
                                Tienda = reader.GetString(reader.GetOrdinal("Tienda"))
                            });
                        }
                    }
                }

                return Ok(ventas);
            }
            catch (SqlException ex)
            {
                // Log the error
                return StatusCode(500, "Error de base de datos: " + ex.Message);
            }
            catch (Exception ex)
            {
                // Log the error
                return StatusCode(500, "Error inesperado: " + ex.Message);
            }
        }

        public class FechaRequest
        {
            public DateTime FechaInicio { get; set; }
            public DateTime FechaFin { get; set; }
        }

        [HttpGet("MostrarTiendas")]
        public IActionResult MostrarTiendas()
        {
            try
            {
                List<TiendasA> tiendas = [];

                using (var conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using (var comando = conexion.CreateCommand())
                    {
                        comando.CommandType = System.Data.CommandType.StoredProcedure;
                        comando.CommandText = "usp_MostrarTiendas";

                        conexion.Open();
                        using (SqlDataReader reader = comando.ExecuteReader())
                        {
                            if (reader.HasRows)
                            {
                                while (reader.Read())
                                {
                                    tiendas.Add(new TiendasA
                                    {
                                        IdTienda = reader.GetInt32(reader.GetOrdinal("idTienda")),
                                        Tienda = reader.GetString(reader.GetOrdinal("Tienda"))
                                    });
                                }
                            }
                        }
                    }
                }

                return Ok(tiendas);
            }
            catch (SqlException ex)
            {
                // Log the error
                return StatusCode(500, "Error de base de datos: " + ex.Message);
            }
            catch (Exception ex)
            {
                // Log the error
                return StatusCode(500, "Error inesperado: " + ex.Message);
            }
        }

        [HttpGet("MostrarFormasDePago")]
        public IActionResult MostrarFormasDePago()
        {
            try
            {
                List<FormasDePagoA> formasDePagos = [];

                using (var conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using (var comando = conexion.CreateCommand())
                    {
                        comando.CommandType = System.Data.CommandType.StoredProcedure;
                        comando.CommandText = "usp_MostrarFormasDePago";

                        conexion.Open();
                        using (SqlDataReader reader = comando.ExecuteReader())
                        {
                            if (reader.HasRows)
                            {
                                while (reader.Read())
                                {
                                    formasDePagos.Add(new FormasDePagoA
                                    {
                                        IdFormaDePago = reader.GetInt32(reader.GetOrdinal("idFormaDePago")),
                                        FormaDePago = reader.GetString(reader.GetOrdinal("FormaDePago"))
                                    });
                                }
                            }
                        }
                    }
                }

                return Ok(formasDePagos);
            }
            catch (SqlException ex)
            {
                // Log the error
                return StatusCode(500, "Error de base de datos: " + ex.Message);
            }
            catch (Exception ex)
            {
                // Log the error
                return StatusCode(500, "Error inesperado: " + ex.Message);
            }
        }

        [HttpGet("MostrarConceptos")]
        public IActionResult MostrarConceptos()
        {
            try
            {
                List<ConceptosA> conceptos = [];

                using (var conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using (var comando = conexion.CreateCommand())
                    {
                        comando.CommandType = System.Data.CommandType.StoredProcedure;
                        comando.CommandText = "usp_MostrarConceptos";

                        conexion.Open();
                        using (SqlDataReader reader = comando.ExecuteReader())
                        {
                            if (reader.HasRows)
                            {
                                while (reader.Read())
                                {
                                    conceptos.Add(new ConceptosA
                                    {
                                        IdConcepto = reader.GetInt32(reader.GetOrdinal("idConcepto")),
                                        Concepto = reader.GetString(reader.GetOrdinal("Concepto"))
                                    });
                                }
                            }
                        }
                    }
                }

                return Ok(conceptos);
            }
            catch (SqlException ex)
            {
                // Log the error
                return StatusCode(500, "Error de base de datos: " + ex.Message);
            }
            catch (Exception ex)
            {
                // Log the error
                return StatusCode(500, "Error inesperado: " + ex.Message);
            }
        }

        [HttpGet("MostrarVendedores")]
        public IActionResult MostrarVendedores()
        {
            try
            {
                List<VendedoresA> vendedores = [];

                using (var conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using (var comando = conexion.CreateCommand())
                    {
                        comando.CommandType = System.Data.CommandType.StoredProcedure;
                        comando.CommandText = "usp_MostrarVendedores";

                        conexion.Open();
                        using (SqlDataReader reader = comando.ExecuteReader())
                        {
                            if (reader.HasRows)
                            {
                                while (reader.Read())
                                {
                                    vendedores.Add(new VendedoresA
                                    {
                                        IdVendedor = reader.GetInt32(reader.GetOrdinal("idVendedor")),
                                        Vendedor = reader.GetString(reader.GetOrdinal("Vendedor"))
                                    });
                                }
                            }
                        }
                    }
                }

                return Ok(vendedores);
            }
            catch (SqlException ex)
            {
                // Log the error
                return StatusCode(500, "Error de base de datos: " + ex.Message);
            }
            catch (Exception ex)
            {
                // Log the error
                return StatusCode(500, "Error inesperado: " + ex.Message);
            }
        }

        [HttpPost("IngresarVenta")]
        public async Task<IActionResult> IngresarVenta([FromBody] VentasA gestor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await using var conexion = (SqlConnection)_context.Database.GetDbConnection();
                await conexion.OpenAsync();

                await using var command = conexion.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "usp_IngresarVenta";

                command.Parameters.Add("@Fecha", SqlDbType.Date).Value = gestor.Fecha;
                command.Parameters.Add("@Monto", SqlDbType.Decimal).Value = gestor.Monto;
                command.Parameters.Add("@Nota", SqlDbType.Int).Value = gestor.Nota;
                command.Parameters.Add("@Comentario", SqlDbType.VarChar).Value = gestor.Comentario ?? (object)DBNull.Value;
                command.Parameters.Add("@FormaDePago", SqlDbType.VarChar).Value = gestor.FormaDePago;
                command.Parameters.Add("@Tienda", SqlDbType.VarChar).Value = gestor.Tienda;
                command.Parameters.Add("@Vendedor", SqlDbType.VarChar).Value = gestor.Vendedor;

                await command.ExecuteNonQueryAsync();

                return Ok("Venta ingresada con éxito");
            }
            catch (SqlException ex)
            {
                // Log the exception
                return StatusCode(500, $"Error en la base de datos: {ex.Message}");
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"Error del servidor: {ex.Message}");
            }
        }

        [HttpPost("IngresarGasto")]
        public async Task<IActionResult> IngresarGasto([FromBody] GastosA gestor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await using var conexion = (SqlConnection)_context.Database.GetDbConnection();
                await conexion.OpenAsync();

                await using var command = conexion.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "usp_IngresarGasto";

                command.Parameters.Add("@Fecha", SqlDbType.Date).Value = gestor.Fecha;
                command.Parameters.Add("@Monto", SqlDbType.Decimal).Value = gestor.Monto;
                command.Parameters.Add("@F", SqlDbType.Decimal).Value = gestor.F;
                command.Parameters.Add("@S", SqlDbType.Decimal).Value = gestor.S;
                command.Parameters.Add("@R", SqlDbType.Int).Value = gestor.R;
                command.Parameters.Add("@Comentario", SqlDbType.VarChar).Value = gestor.Comentario ?? (object)DBNull.Value;
                command.Parameters.Add("@Concepto", SqlDbType.VarChar).Value = gestor.Concepto;
                command.Parameters.Add("@Tienda", SqlDbType.VarChar).Value = gestor.Tienda;

                await command.ExecuteNonQueryAsync();

                return Ok("Gasto ingresado con éxito");
            }
            catch (SqlException ex)
            {
                // Log the exception
                return StatusCode(500, $"Error en la base de datos: {ex.Message}");
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"Error del servidor: {ex.Message}");
            }
        }

        [HttpPost("EliminarVenta")]
        public IActionResult EliminarVenta(VentasA gestor)
        {
            try
            {
                using (SqlConnection conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using (SqlCommand command = conexion.CreateCommand())
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.CommandText = "usp_EliminarVenta";
                        command.Parameters.Add("@idVenta", SqlDbType.Int).Value = gestor.IdVenta;
                        conexion.Open();
                        command.ExecuteNonQuery();
                    }
                }
                return Ok("Venta eliminada");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error del servidor: {ex.Message}");
            }
        }

        [HttpPost("EliminarGasto")]
        public IActionResult EliminarGasto(GastosA gestor)
        {
            try
            {
                using (SqlConnection conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using (SqlCommand command = conexion.CreateCommand())
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.CommandText = "usp_EliminarGasto";
                        command.Parameters.Add("@idGasto", SqlDbType.Int).Value = gestor.IdGasto;
                        conexion.Open();
                        command.ExecuteNonQuery();
                    }
                }
                return Ok("Gasto eliminado");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error del servidor: {ex.Message}");
            }
        }

        [HttpPost("EditarVenta")]
        public IActionResult EditarVenta(VentasA gestor)
        {
            try
            {
                using (var conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using (var comando = conexion.CreateCommand())
                    {
                        conexion.Open();
                        comando.CommandType = System.Data.CommandType.StoredProcedure;
                        comando.CommandText = "usp_ActualizarVenta";

                        comando.Parameters.Add("@idVenta", System.Data.SqlDbType.Int).Value = gestor.IdVenta;
                        comando.Parameters.Add("@Fecha", System.Data.SqlDbType.Date).Value = gestor.Fecha;
                        comando.Parameters.Add("@Tienda", System.Data.SqlDbType.VarChar).Value = gestor.Tienda;
                        comando.Parameters.Add("@Vendedor", System.Data.SqlDbType.VarChar).Value = gestor.Vendedor;
                        comando.Parameters.Add("@Nota", System.Data.SqlDbType.Int).Value = gestor.Nota;
                        comando.Parameters.Add("@Monto", System.Data.SqlDbType.Decimal).Value = gestor.Monto;
                        comando.Parameters.Add("@FormaDePago", System.Data.SqlDbType.VarChar).Value = gestor.FormaDePago;
                        comando.Parameters.Add("@Comentario", System.Data.SqlDbType.VarChar).Value = gestor.Comentario;

                        comando.ExecuteNonQuery();
                    }
                }
                return Ok();
            }
            catch (SqlException sqlEx)
            {
                // Log the exception (optional)
                return StatusCode(500, $"Error en la DB: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                // Log the exception (optional)
                return StatusCode(500, $"Error en el servidor: {ex.Message}");
            }
        }

        [HttpPost("EditarGasto")]
        public IActionResult EditarGasto(GastosA gestor)
        {
            try
            {
                using (var conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using (var comando = conexion.CreateCommand())
                    {
                        conexion.Open();
                        comando.CommandType = System.Data.CommandType.StoredProcedure;
                        comando.CommandText = "usp_ActualizarGasto";

                        comando.Parameters.Add("@idGasto", System.Data.SqlDbType.Int).Value = gestor.IdGasto;
                        comando.Parameters.Add("@Fecha", System.Data.SqlDbType.Date).Value = gestor.Fecha;
                        comando.Parameters.Add("@Monto", System.Data.SqlDbType.Decimal).Value = gestor.Monto;
                        comando.Parameters.Add("@F", System.Data.SqlDbType.Decimal).Value = gestor.F;
                        comando.Parameters.Add("@S", System.Data.SqlDbType.Decimal).Value = gestor.S;
                        comando.Parameters.Add("@R", System.Data.SqlDbType.Int).Value = gestor.R;
                        comando.Parameters.Add("@Comentario", System.Data.SqlDbType.VarChar).Value = gestor.Comentario;
                        comando.Parameters.Add("@Concepto", System.Data.SqlDbType.VarChar).Value = gestor.Concepto;
                        comando.Parameters.Add("@Tienda", System.Data.SqlDbType.VarChar).Value = gestor.Tienda;

                        comando.ExecuteNonQuery();
                    }
                }
                return Ok();
            }
            catch (SqlException sqlEx)
            {
                // Log the exception (optional)
                return StatusCode(500, $"Error en la DB: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                // Log the exception (optional)
                return StatusCode(500, $"Error en el servidor: {ex.Message}");
            }
        }

        [HttpPost("EditarVendedor")]
        public IActionResult EditarVendedor(VendedoresA gestor)
        {
            try
            {
                using (var conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using (var comando = conexion.CreateCommand())
                    {
                        conexion.Open();
                        comando.CommandType = System.Data.CommandType.StoredProcedure;
                        comando.CommandText = "usp_ActualizarVendedor";

                        comando.Parameters.Add("@idVendedor", System.Data.SqlDbType.Int).Value = gestor.IdVendedor;
                        comando.Parameters.Add("@Vendedor", System.Data.SqlDbType.VarChar).Value = gestor.Vendedor;

                        comando.ExecuteNonQuery();
                    }
                }
                return Ok();
            }
            catch (SqlException sqlEx)
            {
                return StatusCode(500, $"Error en la DB: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en el servidor: {ex.Message}");
            }
        }

        [HttpPost("EditarConcepto")]
        public IActionResult EditarConcepto(ConceptosA gestor)
        {
            try
            {
                using (var conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using (var comando = conexion.CreateCommand())
                    {
                        conexion.Open();
                        comando.CommandType = System.Data.CommandType.StoredProcedure;
                        comando.CommandText = "usp_ActualizarConcepto";

                        comando.Parameters.Add("@idConcepto", System.Data.SqlDbType.Int).Value = gestor.IdConcepto;
                        comando.Parameters.Add("@Concepto", System.Data.SqlDbType.VarChar).Value = gestor.Concepto;

                        comando.ExecuteNonQuery();
                    }
                }
                return Ok();
            }
            catch (SqlException sqlEx)
            {
                return StatusCode(500, $"Error en la DB: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en el servidor: {ex.Message}");
            }
        }

        [HttpPost("IngresarVendedor")]
        public async Task<IActionResult> IngresarVendedor([FromBody] VendedoresA gestor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await using var conexion = (SqlConnection)_context.Database.GetDbConnection();
                await conexion.OpenAsync();

                await using var command = conexion.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "usp_IngresarVendedor";

                command.Parameters.Add("@Vendedor", SqlDbType.VarChar).Value = gestor.Vendedor;

                await command.ExecuteNonQueryAsync();

                return Ok("Vendedor ingresado con éxito");
            }
            catch (SqlException ex)
            {
                // Log the exception
                return StatusCode(500, $"Error en la base de datos: {ex.Message}");
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"Error del servidor: {ex.Message}");
            }
        }

        [HttpPost("IngresarConcepto")]
        public async Task<IActionResult> IngresarConcepto([FromBody] ConceptosA gestor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await using var conexion = (SqlConnection)_context.Database.GetDbConnection();
                await conexion.OpenAsync();

                await using var command = conexion.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "usp_IngresarConcepto";

                command.Parameters.Add("@Concepto", SqlDbType.VarChar).Value = gestor.Concepto;

                await command.ExecuteNonQueryAsync();

                return Ok("Concepto ingresado con éxito");
            }
            catch (SqlException ex)
            {
                // Log the exception
                return StatusCode(500, $"Error en la base de datos: {ex.Message}");
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"Error del servidor: {ex.Message}");
            }
        }

        [HttpPost("EliminarVendedor")]
        public IActionResult EliminarVendedor(VendedoresA gestor)
        {
            try
            {
                using (SqlConnection conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using (SqlCommand command = conexion.CreateCommand())
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.CommandText = "usp_EliminarVendedor";
                        command.Parameters.Add("@idVendedor", SqlDbType.Int).Value = gestor.IdVendedor;
                        conexion.Open();
                        command.ExecuteNonQuery();
                    }
                }
                return Ok("Vendedor eliminado");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error del servidor: {ex.Message}");
            }
        }

        [HttpPost("EliminarConcepto")]
        public IActionResult EliminarConcepto(ConceptosA gestor)
        {
            try
            {
                using (SqlConnection conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using (SqlCommand command = conexion.CreateCommand())
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.CommandText = "usp_EliminarConcepto";
                        command.Parameters.Add("@idConcepto", SqlDbType.Int).Value = gestor.IdConcepto;
                        conexion.Open();
                        command.ExecuteNonQuery();
                    }
                }
                return Ok("Concepto eliminado");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error del servidor: {ex.Message}");
            }
        }

        [HttpGet("TotalesFormaDePago")]
        public IActionResult TotalesFormaDePago(DateTime fecha, string tienda, string vendedor)
        {
            try
            {
                List<TotalesPorFormaDePago> totales = new List<TotalesPorFormaDePago>();

                using (SqlConnection conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using (SqlCommand command = conexion.CreateCommand())
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.CommandText = "usp_VentaTotalPorFormaDePago";
                        command.Parameters.AddWithValue("@Fecha", fecha);
                        command.Parameters.AddWithValue("@Tienda", tienda);
                        command.Parameters.AddWithValue("@Vendedor", vendedor);
                        conexion.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.HasRows)
                            {
                                while (reader.Read())
                                {
                                    totales.Add(new TotalesPorFormaDePago
                                    {
                                        TotalEfectivo = reader.GetDecimal(reader.GetOrdinal("TotalEfectivo")),
                                        TotalTarjeta = reader.GetDecimal(reader.GetOrdinal("TotalTarjeta")),
                                        TotalTransferencia = reader.GetDecimal(reader.GetOrdinal("TotalTransferencia")),
                                        TotalDeposito = reader.GetDecimal(reader.GetOrdinal("TotalDeposito"))
                                    });
                                }
                            }
                        }
                    }
                }
                return Ok(totales);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error del servidor: {ex.Message}");
            }
        }

        public class TotalesPorFormaDePago
        {
            public decimal TotalEfectivo { get; set; }
            public decimal TotalTarjeta { get; set; }
            public decimal TotalTransferencia { get; set; }
            public decimal TotalDeposito { get; set; }
        }

        [HttpGet("MontoTotalGastos")]
        public IActionResult MontoTotalGastos(DateTime fecha, string tienda)
        {
            try
            {
                List<SumaMontosResult> total = new List<SumaMontosResult>();

                using (SqlConnection conexion = (SqlConnection)_context.Database.GetDbConnection())
                {
                    using (SqlCommand command = conexion.CreateCommand())
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.CommandText = "usp_GastoTotalPorMonto";
                        command.Parameters.AddWithValue("@Fecha", fecha);
                        command.Parameters.AddWithValue("@Tienda", tienda);
                        conexion.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.HasRows)
                            {
                                while (reader.Read())
                                {
                                    total.Add(new SumaMontosResult
                                    {
                                        TotalMontos = reader.GetDecimal(reader.GetOrdinal("TotalMontos"))
                                    });
                                }
                            }
                        }
                    }
                }
                return Ok(total);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error del servidor: {ex.Message}");
            }
        }

        public class SumaMontosResult
        {
            public decimal TotalMontos { get; set; }
        }

    }
}
