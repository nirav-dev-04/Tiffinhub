namespace TiffinHub.Domain.Entities;

public class PlatformSettings
{
    /// <summary>
    /// Singleton ID, always 1.
    /// </summary>
    public int Id { get; set; } = 1;

    /// <summary>
    /// Platform commission percentage in basis points (e.g. 1000 = 10.00%).
    /// </summary>
    public int CommissionPercent { get; set; } = 1000;

    /// <summary>
    /// Days before delivery date for Lunch/Dinner cutoff (default: 1 = previous day).
    /// </summary>
    public int DefaultLunchDinnerCutoffDaysBefore { get; set; } = 1;

    /// <summary>
    /// Hour (0-23 in IST) for Lunch/Dinner cutoff (default: 20 = 8 PM IST).
    /// </summary>
    public int DefaultLunchDinnerCutoffHour { get; set; } = 20;

    /// <summary>
    /// Minute (0-59 in IST) for Lunch/Dinner cutoff (default: 0).
    /// </summary>
    public int DefaultLunchDinnerCutoffMinute { get; set; } = 0;

    /// <summary>
    /// Days before delivery date for Breakfast cutoff (default: 1 = previous day).
    /// </summary>
    public int DefaultBreakfastCutoffDaysBefore { get; set; } = 1;

    /// <summary>
    /// Hour (0-23 in IST) for Breakfast cutoff (default: 22 = 10 PM IST).
    /// </summary>
    public int DefaultBreakfastCutoffHour { get; set; } = 22;

    /// <summary>
    /// Minute (0-59 in IST) for Breakfast cutoff (default: 0).
    /// </summary>
    public int DefaultBreakfastCutoffMinute { get; set; } = 0;

    /// <summary>
    /// Whether pausing a subscription extends the end date by the paused days (default: true).
    /// </summary>
    public bool PauseExtendsEndDate { get; set; } = true;

    /// <summary>
    /// Timestamp of last modification.
    /// </summary>
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
