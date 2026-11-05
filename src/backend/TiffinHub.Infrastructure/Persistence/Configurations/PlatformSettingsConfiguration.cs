using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TiffinHub.Domain.Entities;

namespace TiffinHub.Infrastructure.Persistence.Configurations;

public class PlatformSettingsConfiguration : IEntityTypeConfiguration<PlatformSettings>
{
    public void Configure(EntityTypeBuilder<PlatformSettings> builder)
    {
        builder.HasKey(p => p.Id);

        // Ensure Id is treated as a fixed value (not auto-increment)
        builder.Property(p => p.Id)
            .ValueGeneratedNever();

        builder.Property(p => p.CommissionPercent)
            .IsRequired()
            .HasDefaultValue(1000); // 10.00%

        builder.Property(p => p.DefaultLunchDinnerCutoffDaysBefore)
            .IsRequired()
            .HasDefaultValue(1);

        builder.Property(p => p.DefaultLunchDinnerCutoffHour)
            .IsRequired()
            .HasDefaultValue(20);

        builder.Property(p => p.DefaultLunchDinnerCutoffMinute)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(p => p.DefaultBreakfastCutoffDaysBefore)
            .IsRequired()
            .HasDefaultValue(1);

        builder.Property(p => p.DefaultBreakfastCutoffHour)
            .IsRequired()
            .HasDefaultValue(22);

        builder.Property(p => p.DefaultBreakfastCutoffMinute)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(p => p.PauseExtendsEndDate)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(p => p.UpdatedAtUtc)
            .IsRequired();

        // Seed singleton default record
        builder.HasData(new PlatformSettings
        {
            Id = 1,
            CommissionPercent = 1000,
            DefaultLunchDinnerCutoffDaysBefore = 1,
            DefaultLunchDinnerCutoffHour = 20,
            DefaultLunchDinnerCutoffMinute = 0,
            DefaultBreakfastCutoffDaysBefore = 1,
            DefaultBreakfastCutoffHour = 22,
            DefaultBreakfastCutoffMinute = 0,
            PauseExtendsEndDate = true,
            UpdatedAtUtc = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });
    }
}
