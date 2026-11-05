using FluentAssertions;
using TiffinHub.Infrastructure.Services;
using Xunit;

namespace TiffinHub.Tests;

public class TimeZoneHelperTests
{
    private readonly TimeZoneHelper _helper = new();

    [Fact]
    public void ConvertToIst_ShouldAdd5Hours30Minutes_WhenGivenUtcTime()
    {
        // 15:30 UTC = 21:00 IST (Hangfire nightly order job trigger time)
        var utc = new DateTime(2026, 11, 5, 15, 30, 0, DateTimeKind.Utc);

        var ist = _helper.ConvertToIst(utc);

        ist.Year.Should().Be(2026);
        ist.Month.Should().Be(11);
        ist.Day.Should().Be(5);
        ist.Hour.Should().Be(21);
        ist.Minute.Should().Be(0);
        ist.Second.Should().Be(0);
    }

    [Fact]
    public void ConvertToUtc_ShouldSubtract5Hours30Minutes_WhenGivenIstTime()
    {
        // 21:00 IST = 15:30 UTC
        var ist = new DateTime(2026, 11, 5, 21, 0, 0, DateTimeKind.Unspecified);

        var utc = _helper.ConvertToUtc(ist);

        utc.Year.Should().Be(2026);
        utc.Month.Should().Be(11);
        utc.Day.Should().Be(5);
        utc.Hour.Should().Be(15);
        utc.Minute.Should().Be(30);
        utc.Second.Should().Be(0);
    }

    [Fact]
    public void MidnightCrossover_ShouldTransitionDatesCorrectly()
    {
        // 2026-11-05 20:00:00 UTC + 5h30m = 2026-11-06 01:30:00 IST (next calendar day in India)
        var utc = new DateTime(2026, 11, 5, 20, 0, 0, DateTimeKind.Utc);

        var ist = _helper.ConvertToIst(utc);

        ist.Day.Should().Be(6);
        ist.Hour.Should().Be(1);
        ist.Minute.Should().Be(30);
    }

    [Fact]
    public void GetUtcCutoffDateTime_ShouldCalculatePreviousDay8PmIst_ForLunchDinnerCutoff()
    {
        // Delivery Date: 2026-11-10
        // Lunch/Dinner Cutoff: 1 day before at 20:00 (8 PM) IST
        // Expected IST Cutoff: 2026-11-09 20:00:00
        // Expected UTC Cutoff: 2026-11-09 14:30:00
        var deliveryDate = new DateOnly(2026, 11, 10);

        var cutoffUtc = _helper.GetUtcCutoffDateTime(
            deliveryDate: deliveryDate,
            daysBefore: 1,
            cutoffHourIst: 20,
            cutoffMinuteIst: 0);

        cutoffUtc.Year.Should().Be(2026);
        cutoffUtc.Month.Should().Be(11);
        cutoffUtc.Day.Should().Be(9);
        cutoffUtc.Hour.Should().Be(14);
        cutoffUtc.Minute.Should().Be(30);
    }

    [Fact]
    public void GetUtcCutoffDateTime_ShouldCalculatePreviousDay10PmIst_ForBreakfastCutoff()
    {
        // Delivery Date: 2026-11-10
        // Breakfast Cutoff: 1 day before at 22:00 (10 PM) IST
        // Expected IST Cutoff: 2026-11-09 22:00:00
        // Expected UTC Cutoff: 2026-11-09 16:30:00
        var deliveryDate = new DateOnly(2026, 11, 10);

        var cutoffUtc = _helper.GetUtcCutoffDateTime(
            deliveryDate: deliveryDate,
            daysBefore: 1,
            cutoffHourIst: 22,
            cutoffMinuteIst: 0);

        cutoffUtc.Year.Should().Be(2026);
        cutoffUtc.Month.Should().Be(11);
        cutoffUtc.Day.Should().Be(9);
        cutoffUtc.Hour.Should().Be(16);
        cutoffUtc.Minute.Should().Be(30);
    }

    [Fact]
    public void HasCutoffPassed_ShouldReturnFalse_WhenCurrentTimeIsBeforeCutoff()
    {
        var deliveryDate = new DateOnly(2026, 11, 10);
        // Cutoff is 2026-11-09 14:30:00 UTC
        var simulatedNowUtc = new DateTime(2026, 11, 9, 14, 29, 59, DateTimeKind.Utc);

        var hasPassed = _helper.HasCutoffPassed(
            deliveryDate: deliveryDate,
            daysBefore: 1,
            cutoffHourIst: 20,
            cutoffMinuteIst: 0,
            utcNow: simulatedNowUtc);

        hasPassed.Should().BeFalse();
    }

    [Fact]
    public void HasCutoffPassed_ShouldReturnTrue_WhenCurrentTimeIsAtOrAfterCutoff()
    {
        var deliveryDate = new DateOnly(2026, 11, 10);
        // Cutoff is 2026-11-09 14:30:00 UTC
        var simulatedNowUtc = new DateTime(2026, 11, 9, 14, 30, 0, DateTimeKind.Utc);

        var hasPassed = _helper.HasCutoffPassed(
            deliveryDate: deliveryDate,
            daysBefore: 1,
            cutoffHourIst: 20,
            cutoffMinuteIst: 0,
            utcNow: simulatedNowUtc);

        hasPassed.Should().BeTrue();
    }

    [Fact]
    public void GetIstToday_And_GetIstTomorrow_ShouldBeConsecutiveDays()
    {
        var today = _helper.GetIstToday();
        var tomorrow = _helper.GetIstTomorrow();

        tomorrow.Should().Be(today.AddDays(1));
    }
}
