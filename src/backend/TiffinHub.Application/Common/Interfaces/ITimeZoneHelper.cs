namespace TiffinHub.Application.Common.Interfaces;

public interface ITimeZoneHelper
{
    /// <summary>
    /// Gets the TimeZoneInfo for India Standard Time (IST).
    /// </summary>
    TimeZoneInfo IstTimeZone { get; }

    /// <summary>
    /// Converts a UTC DateTime to IST DateTime.
    /// </summary>
    DateTime ConvertToIst(DateTime utcDateTime);

    /// <summary>
    /// Converts an IST DateTime to UTC DateTime.
    /// </summary>
    DateTime ConvertToUtc(DateTime istDateTime);

    /// <summary>
    /// Gets current DateTime in IST.
    /// </summary>
    DateTime GetIstNow();

    /// <summary>
    /// Gets today's DateOnly in IST.
    /// </summary>
    DateOnly GetIstToday();

    /// <summary>
    /// Gets tomorrow's DateOnly in IST.
    /// </summary>
    DateOnly GetIstTomorrow();

    /// <summary>
    /// Calculates the UTC cutoff DateTime for a given delivery date and cutoff specification.
    /// </summary>
    DateTime GetUtcCutoffDateTime(DateOnly deliveryDate, int daysBefore, int cutoffHourIst, int cutoffMinuteIst);

    /// <summary>
    /// Determines whether the cutoff has passed for a given delivery date and cutoff specification.
    /// </summary>
    bool HasCutoffPassed(DateOnly deliveryDate, int daysBefore, int cutoffHourIst, int cutoffMinuteIst, DateTime? utcNow = null);
}
