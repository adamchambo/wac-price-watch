using api.Enums;

namespace api.DTOs.UserSettings;

public record UserSettingsResponse(
    Store DefaultStore,
    string Currency,
    PriceCheckFrequency? PriceCheckFrequency,
    DateTime? PriceCheckStartAt,
    string? PriceCheckTimezone,
    ThemePreference Theme,
    bool EmailAlertsEnabled,
    bool SmsAlertsEnabled
);
