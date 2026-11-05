namespace TiffinHub.Application.DTOs.Auth;

public record RegisterRequest(
    string Name,
    string Email,
    string Password,
    string? Phone,
    string Role
);

public record LoginRequest(
    string Email,
    string Password
);

public record RefreshTokenRequest(
    string RefreshToken
);

public record UserSummaryDto(
    Guid Id,
    string Name,
    string Email,
    string? Phone,
    string Role
);

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    int ExpiresInMinutes,
    UserSummaryDto User
);
