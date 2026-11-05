using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Serilog;
using TiffinHub.Api.Middleware;
using TiffinHub.Application.Common.Interfaces;
using TiffinHub.Domain.Constants;
using TiffinHub.Domain.Entities;
using TiffinHub.Infrastructure;
using TiffinHub.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
    .CreateLogger();

builder.Host.UseSerilog();

// 2. Add Services
builder.Services.AddInfrastructureServices(builder.Configuration);

// Exception Handling & Problem Details
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Rate Limiting (Brute-force protection: max 10 requests per minute per IP)
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("auth-rate-limit", httpContext =>
    {
        var clientIp = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown-client";
        return RateLimitPartition.GetFixedWindowLimiter(clientIp, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 10,
            Window = TimeSpan.FromMinutes(1),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 0
        });
    });
});

// Controllers & Endpoints
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "TiffinHub API",
        Version = "v1",
        Description = "TiffinHub multi-role tiffin subscription platform API"
    });
});

// CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultCorsPolicy", policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? new[] { "http://localhost:5173", "https://localhost:5173", "https://tiffinhub-app.vercel.app" };

        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// 3. Database Schema Verification, Role & Demo User Seeding
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.EnsureCreated();

        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = services.GetRequiredService<UserManager<User>>();

        // Seed Default Roles
        foreach (var roleName in Roles.All)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
            }
        }

        // Seed 4 Role Demo Accounts for Instant Testing & Evaluation
        var demoUsers = new[]
        {
            (Email: "admin@tiffinhub.com", Name: "Platform Owner", Pass: "Admin@123", Role: Roles.Admin, Phone: "+919900011000"),
            (Email: "vendor@tiffinhub.com", Name: "Anand Kitchen", Pass: "Pass@123", Role: Roles.Vendor, Phone: "+919876500001"),
            (Email: "customer@tiffinhub.com", Name: "Rahul Sharma", Pass: "Pass@123", Role: Roles.Customer, Phone: "+919876500002"),
            (Email: "rider@tiffinhub.com", Name: "Vikram Rider", Pass: "Pass@123", Role: Roles.DeliveryPartner, Phone: "+919876500003")
        };

        foreach (var (email, name, pass, role, phone) in demoUsers)
        {
            var existing = await userManager.FindByEmailAsync(email);
            if (existing == null)
            {
                var newUser = new User
                {
                    UserName = email,
                    Email = email,
                    Name = name,
                    Phone = phone,
                    IsActive = true,
                    CreatedAtUtc = DateTime.UtcNow
                };

                var createRes = await userManager.CreateAsync(newUser, pass);
                if (createRes.Succeeded)
                {
                    await userManager.AddToRoleAsync(newUser, role);
                    Log.Information("Seeded demo user: {Email} ({Role})", email, role);
                }
            }
        }

        Log.Information("Database schema verified and default roles + demo accounts initialized successfully.");
    }
    catch (Exception ex)
    {
        Log.Warning(ex, "Could not initialize database on startup (Check PostgreSQL connection string).");
    }
}

// 4. Configure HTTP Pipeline
app.UseExceptionHandler();

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TiffinHub API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseSerilogRequestLogging();
app.UseCors("DefaultCorsPolicy");
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health Check Endpoint
app.MapGet("/health", (ITimeZoneHelper timeZoneHelper) =>
{
    return Results.Ok(new
    {
        status = "Healthy",
        service = "TiffinHub API",
        version = "1.0.0",
        environment = app.Environment.EnvironmentName,
        utcTime = DateTime.UtcNow,
        istTime = timeZoneHelper.GetIstNow(),
        timezone = timeZoneHelper.IstTimeZone.DisplayName
    });
})
.WithName("HealthCheck")
.WithTags("System");

// Root redirect to swagger or health
app.MapGet("/", () => Results.Redirect("/health"));

try
{
    Log.Information("Starting TiffinHub API host...");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "TiffinHub API host terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
