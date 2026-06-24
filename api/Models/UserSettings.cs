using api.Enums;

namespace api.Models;

public class UserSettings
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public Store DefaultStore { get; set; } = Store.Coles;

    public string Currency { get; set; } = "AUD";

    public PriceCheckFrequency? PriceCheckFrequency { get; set; }

    public TimeOnly? PriceCheckTimeOfDay { get; set; }

    public string? PriceCheckTimezone { get; set; }

    public WeekDay? PriceCheckDayOfWeek { get; set; }

    public string? BlockedPriceCheckDays { get; set; }

    public ThemePreference Theme { get; set; } = ThemePreference.System;

    public bool EmailAlertsEnabled { get; set; }

    public bool SmsAlertsEnabled { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
