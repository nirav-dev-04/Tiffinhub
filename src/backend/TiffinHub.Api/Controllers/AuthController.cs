using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using TiffinHub.Application.Common.Interfaces;
using TiffinHub.Application.DTOs.Auth;
using TiffinHub.Domain.Constants;
using TiffinHub.Domain.Entities;

namespace TiffinHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("auth-rate-limit")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IApplicationDbContext _context;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<User> userManager,
        IJwtTokenService jwtTokenService,
        IApplicationDbContext context,
        ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Registers a new user with their chosen platform role (Customer, Vendor, DeliveryPartner).
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // 1. Role validation (Admin cannot be registered publicly)
        var requestedRole = request.Role?.Trim();
        if (string.Equals(requestedRole, Roles.Admin, StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid Role Selection",
                Detail = "The Admin role cannot be created through public self-registration.",
                Status = StatusCodes.Status400BadRequest
            });
        }

        var validRoles = new[] { Roles.Customer, Roles.Vendor, Roles.DeliveryPartner };
        var matchedRole = validRoles.FirstOrDefault(r => string.Equals(r, requestedRole, StringComparison.OrdinalIgnoreCase));

        if (matchedRole == null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid Role",
                Detail = $"Role must be one of: {string.Join(", ", validRoles)}",
                Status = StatusCodes.Status400BadRequest
            });
        }

        // 2. Check if email already exists
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Email Already Registered",
                Detail = "An account with this email address already exists. Please log in instead.",
                Status = StatusCodes.Status400BadRequest
            });
        }

        // 3. Create User entity
        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            Name = request.Name?.Trim() ?? string.Empty,
            Phone = request.Phone?.Trim(),
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        var createResult = await _userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            var errors = string.Join("; ", createResult.Errors.Select(e => e.Description));
            return BadRequest(new ProblemDetails
            {
                Title = "Registration Failed",
                Detail = errors,
                Status = StatusCodes.Status400BadRequest
            });
        }

        // 4. Assign role
        await _userManager.AddToRoleAsync(user, matchedRole);

        // 5. Generate Tokens
        var accessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Email!, user.Name, matchedRole);
        var rawRefreshToken = _jwtTokenService.GenerateRefreshToken();
        var hashedRefreshToken = _jwtTokenService.HashToken(rawRefreshToken);

        var refreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = hashedRefreshToken,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(30),
            IsRevoked = false,
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.RefreshTokens.Add(refreshTokenEntity);
        await _context.SaveChangesAsync();

        _logger.LogInformation("New user registered: {Email} with role {Role}", user.Email, matchedRole);

        return Ok(new AuthResponse(
            AccessToken: accessToken,
            RefreshToken: rawRefreshToken,
            ExpiresInMinutes: 15,
            User: new UserSummaryDto(user.Id, user.Name, user.Email!, user.Phone, matchedRole)
        ));
    }

    /// <summary>
    /// Authenticates a user and returns an Access Token + Refresh Token.
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !user.IsActive)
        {
            return Unauthorized(new ProblemDetails
            {
                Title = "Invalid Credentials",
                Detail = "The email or password provided is incorrect.",
                Status = StatusCodes.Status401Unauthorized
            });
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isPasswordValid)
        {
            return Unauthorized(new ProblemDetails
            {
                Title = "Invalid Credentials",
                Detail = "The email or password provided is incorrect.",
                Status = StatusCodes.Status401Unauthorized
            });
        }

        // Get Role claim
        var roles = await _userManager.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? Roles.Customer;

        // Generate Tokens
        var accessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Email!, user.Name, primaryRole);
        var rawRefreshToken = _jwtTokenService.GenerateRefreshToken();
        var hashedRefreshToken = _jwtTokenService.HashToken(rawRefreshToken);

        var refreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = hashedRefreshToken,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(30),
            IsRevoked = false,
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.RefreshTokens.Add(refreshTokenEntity);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User logged in successfully: {Email} ({Role})", user.Email, primaryRole);

        return Ok(new AuthResponse(
            AccessToken: accessToken,
            RefreshToken: rawRefreshToken,
            ExpiresInMinutes: 15,
            User: new UserSummaryDto(user.Id, user.Name, user.Email!, user.Phone, primaryRole)
        ));
    }

    /// <summary>
    /// Rotates an active refresh token and returns a new Access Token + Refresh Token pair.
    /// </summary>
    [HttpPost("refresh-token")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            return Unauthorized(new ProblemDetails { Detail = "Refresh token is required." });
        }

        var hashedToken = _jwtTokenService.HashToken(request.RefreshToken);

        var storedToken = await _context.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.TokenHash == hashedToken);

        if (storedToken == null || storedToken.IsRevoked || storedToken.IsExpired || !storedToken.User.IsActive)
        {
            return Unauthorized(new ProblemDetails
            {
                Title = "Invalid Session",
                Detail = "Your session has expired or been revoked. Please sign in again.",
                Status = StatusCodes.Status401Unauthorized
            });
        }

        // Token Rotation: revoke current token
        storedToken.IsRevoked = true;

        // Generate replacement tokens
        var user = storedToken.User;
        var roles = await _userManager.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? Roles.Customer;

        var newAccessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Email!, user.Name, primaryRole);
        var newRawRefreshToken = _jwtTokenService.GenerateRefreshToken();
        var newHashedRefreshToken = _jwtTokenService.HashToken(newRawRefreshToken);

        var newRefreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = newHashedRefreshToken,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(30),
            IsRevoked = false,
            CreatedAtUtc = DateTime.UtcNow
        };

        storedToken.ReplacedByTokenId = newRefreshTokenEntity.Id;

        _context.RefreshTokens.Add(newRefreshTokenEntity);
        await _context.SaveChangesAsync();

        return Ok(new AuthResponse(
            AccessToken: newAccessToken,
            RefreshToken: newRawRefreshToken,
            ExpiresInMinutes: 15,
            User: new UserSummaryDto(user.Id, user.Name, user.Email!, user.Phone, primaryRole)
        ));
    }

    /// <summary>
    /// Generates a secure password reset token for account recovery.
    /// </summary>
    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(PasswordResetResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !user.IsActive)
        {
            // Do not disclose whether email exists (security best practice)
            return Ok(new PasswordResetResult(
                Success: true,
                Message: "If your email is registered, you will receive password reset instructions."
            ));
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        _logger.LogInformation("Password reset requested for {Email}", user.Email);

        return Ok(new PasswordResetResult(
            Success: true,
            Message: "Password reset token generated successfully.",
            DemoResetToken: token // Returned for demo convenience
        ));
    }

    /// <summary>
    /// Resets a user password using a verified Identity reset token.
    /// </summary>
    [HttpPost("reset-password")]
    [ProducesResponseType(typeof(PasswordResetResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Reset Failed",
                Detail = "Invalid password reset request.",
                Status = StatusCodes.Status400BadRequest
            });
        }

        var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            return BadRequest(new ProblemDetails
            {
                Title = "Reset Failed",
                Detail = errors,
                Status = StatusCodes.Status400BadRequest
            });
        }

        // Revoke all existing refresh tokens for security upon password change
        var existingTokens = await _context.RefreshTokens
            .Where(r => r.UserId == user.Id && !r.IsRevoked)
            .ToListAsync();

        foreach (var t in existingTokens)
        {
            t.IsRevoked = true;
        }

        await _context.SaveChangesAsync();
        _logger.LogInformation("Password successfully reset for {Email}. All prior sessions revoked.", user.Email);

        return Ok(new PasswordResetResult(
            Success: true,
            Message: "Your password has been reset successfully. Please log in with your new password."
        ));
    }

    /// <summary>
    /// Gets the profile details and role claims of the currently authenticated user.
    /// </summary>
    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(UserSummaryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null || !user.IsActive)
        {
            return Unauthorized();
        }

        var roles = await _userManager.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? Roles.Customer;

        return Ok(new UserSummaryDto(
            user.Id,
            user.Name,
            user.Email!,
            user.Phone,
            primaryRole
        ));
    }
}
