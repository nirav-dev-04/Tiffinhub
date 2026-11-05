namespace TiffinHub.Application.Common.Interfaces;

public interface IJwtTokenService
{
    /// <summary>
    /// Generates a signed JWT access token containing User ID, Email, Name, and Role claims.
    /// </summary>
    string GenerateAccessToken(Guid userId, string email, string name, string role);

    /// <summary>
    /// Generates a cryptographically random, URL-safe refresh token string.
    /// </summary>
    string GenerateRefreshToken();

    /// <summary>
    /// Computes SHA-256 hash of a plain refresh token string for secure database storage.
    /// </summary>
    string HashToken(string token);
}
