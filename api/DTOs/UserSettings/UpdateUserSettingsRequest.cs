using api.Enums;

namespace api.DTOs.UserSettings;

public record UpdateUserSettingsRequest(
    Store DefaultStore,
    PriceCheckFrequency? PriceCheckFrequency,
    DateTime? PriceCheckStartAt,
    string? PriceCheckTimezone,
    ThemePreference Theme,
    bool EmailAlertsEnabled,
    bool SmsAlertsEnabled
);
