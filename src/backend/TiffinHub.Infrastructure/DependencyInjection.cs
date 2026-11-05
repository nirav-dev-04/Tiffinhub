using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using TiffinHub.Application.Common.Interfaces;
using TiffinHub.Domain.Constants;
using TiffinHub.Domain.Entities;
using TiffinHub.Infrastructure.Persistence;
using TiffinHub.Infrastructure.Services;

namespace TiffinHub.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Read connection string from Configuration (appsettings, User Secrets, or Environment Variables)
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? "Host=localhost;Port=5432;Database=tiffinhub_dev;Username=postgres;Password=postgres";

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                npgsqlOptions.EnableRetryOnFailure(maxRetryCount: 3);
            });
        });

        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());

        // Data Protection for Identity Token Providers
        var keysFolder = Path.Combine(AppContext.BaseDirectory, "DataProtection-Keys");
        Directory.CreateDirectory(keysFolder);
        services.AddDataProtection()
            .PersistKeysToFileSystem(new DirectoryInfo(keysFolder));

        // ASP.NET Core Identity Core
        services.AddIdentityCore<User>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 6;
            options.User.RequireUniqueEmail = true;
        })
        .AddRoles<IdentityRole<Guid>>()
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        // JWT Services & Token Generation
        services.AddSingleton<IJwtTokenService, JwtTokenService>();

        // JWT Bearer Authentication Configuration
        var jwtSecret = configuration["Jwt:SecretKey"]
            ?? Environment.GetEnvironmentVariable("Jwt__SecretKey")
            ?? "TiffinHub_Production_Super_Secret_Key_At_Least_32_Chars_Long_2026_Secure!";
        var jwtIssuer = configuration["Jwt:Issuer"] ?? "TiffinHub";
        var jwtAudience = configuration["Jwt:Audience"] ?? "TiffinHubClients";

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false; // set true in strict prod if needed
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                ValidateIssuer = true,
                ValidIssuer = jwtIssuer,
                ValidateAudience = true,
                ValidAudience = jwtAudience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromSeconds(30)
            };
        });

        // Role-Based Authorization Policies
        services.AddAuthorization(options =>
        {
            options.AddPolicy("RequireAdmin", policy => policy.RequireRole(Roles.Admin));
            options.AddPolicy("RequireVendor", policy => policy.RequireRole(Roles.Vendor));
            options.AddPolicy("RequireCustomer", policy => policy.RequireRole(Roles.Customer));
            options.AddPolicy("RequireDeliveryPartner", policy => policy.RequireRole(Roles.DeliveryPartner));
        });

        // TimeZone Helper
        services.AddSingleton<ITimeZoneHelper, TimeZoneHelper>();

        return services;
    }
}
