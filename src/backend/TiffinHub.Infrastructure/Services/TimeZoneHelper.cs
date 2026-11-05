using TiffinHub.Application.Common.Interfaces;

namespace TiffinHub.Infrastructure.Services;

public class TimeZoneHelper : ITimeZoneHelper
{
    private readonly TimeZoneInfo _istTimeZone;

    public TimeZoneInfo IstTimeZone => _istTimeZone;

    public TimeZoneHelper()
    {
        _istTimeZone = ResolveIstTimeZone();
    }

    /// <summary>
    /// Cross-platform resolver for India Standard Time (UTC+05:30).
    /// Handles Windows ("India Standard Time"), Linux/macOS ("Asia/Kolkata"),
    /// and fallback custom timezone creation.
    /// </summary>
    private static TimeZoneInfo ResolveIstTimeZone()
    {
        // Try IANA identifier first (Linux / macOS / .NET 6+ cross-platform)
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById("Asia/Kolkata");
        }
        catch (TimeZoneNotFoundException) { }

        // Try Windows identifier ("India Standard Time")
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
        }
        catch (TimeZoneNotFoundException) { }

        // Fallback: create fixed UTC+05:30 timezone
        return TimeZoneInfo.CreateCustomTimeZone(
            id: "IST",
            baseUtcOffset: TimeSpan.FromHours(5.5),
            displayName: "(UTC+05:30) India Standard Time",
            standardDisplayName: "India Standard Time");
    }

    public DateTime ConvertToIst(DateTime utcDateTime)
    {
        var utc = utcDateTime.Kind switch
        {
            DateTimeKind.Utc => utcDateTime,
            DateTimeKind.Unspecified => DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc),
            DateTimeKind.Local => utcDateTime.ToUniversalTime(),
            _ => utcDateTime
        };

        return TimeZoneInfo.ConvertTimeFromUtc(utc, _istTimeZone);
    }

    public DateTime ConvertToUtc(DateTime istDateTime)
    {
        var ist = istDateTime.Kind switch
        {
            DateTimeKind.Utc => ConvertToIst(istDateTime),
            _ => DateTime.SpecifyKind(istDateTime, DateTimeKind.Unspecified)
        };

        return TimeZoneInfo.ConvertTimeToUtc(ist, _istTimeZone);
    }

    public DateTime GetIstNow()
    {
        return ConvertToIst(DateTime.UtcNow);
    }

    public DateOnly GetIstToday()
    {
        return DateOnly.FromDateTime(GetIstNow());
    }

    public DateOnly GetIstTomorrow()
    {
        return GetIstToday().AddDays(1);
    }

    public DateTime GetUtcCutoffDateTime(DateOnly deliveryDate, int daysBefore, int cutoffHourIst, int cutoffMinuteIst)
    {
        var cutoffDate = deliveryDate.AddDays(-daysBefore);
        var istCutoff = new DateTime(
            cutoffDate.Year,
            cutoffDate.Month,
            cutoffDate.Day,
            cutoffHourIst,
            cutoffMinuteIst,
            0,
            DateTimeKind.Unspecified);

        return ConvertToUtc(istCutoff);
    }

    public bool HasCutoffPassed(DateOnly deliveryDate, int daysBefore, int cutoffHourIst, int cutoffMinuteIst, DateTime? utcNow = null)
    {
        var now = utcNow ?? DateTime.UtcNow;
        var cutoffUtc = GetUtcCutoffDateTime(deliveryDate, daysBefore, cutoffHourIst, cutoffMinuteIst);
        return now >= cutoffUtc;
    }
}
