using api.Enums;

namespace api.DTOs.UserSettings;

public record UserSettingsResponse(
    Store DefaultStore,
    string Currency,
    PriceCheckFrequency? PriceCheckFrequency,
    TimeOnly? PriceCheckTimeOfDay,
    string? PriceCheckTimezone,
    WeekDay? PriceCheckDayOfWeek,
    string? BlockedPriceCheckDays,
    ThemePreference Theme,
    bool EmailAlertsEnabled,
    bool SmsAlertsEnabled
);
