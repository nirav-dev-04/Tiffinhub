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

public record ForgotPasswordRequest(
    string Email
);

public record ResetPasswordRequest(
    string Email,
    string Token,
    string NewPassword
);

public record PasswordResetResult(
    bool Success,
    string Message,
    string? DemoResetToken = null
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
