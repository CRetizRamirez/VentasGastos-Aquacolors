using Microsoft.EntityFrameworkCore;
using VentasGastos.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<DbVentasGastosAContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("cnnSQL"));
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
