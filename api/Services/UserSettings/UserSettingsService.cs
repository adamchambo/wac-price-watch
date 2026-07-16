using api.DTOs.UserSettings;
using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;
namespace api.Services.UserSettings;

public class UserSettingsService : IUserSettingsService
{
    private readonly AppDbContext _dbContext;
    public UserSettingsService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<UserSettingsResponse> GetUserSettingsAsync(
        string userId,
        CancellationToken cancellationToken = default
    )
    {
        var settings = await InitialiseUserSettings(userId, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return ToResponse(settings);
    }

    public async Task<UserSettingsResponse> UpdateUserSettingsAsync(
        string userId,
        UpdateUserSettingsRequest request,
        CancellationToken cancellationToken = default
    )
    {
        ArgumentNullException.ThrowIfNull(request);

        var settings = await InitialiseUserSettings(userId, cancellationToken);

        settings.DefaultStore = request.DefaultStore;
        settings.PriceCheckFrequency = request.PriceCheckFrequency;
        settings.PriceCheckTimeOfDay = request.PriceCheckTimeOfDay;
        settings.PriceCheckTimezone = request.PriceCheckTimezone;
        settings.PriceCheckDayOfWeek = request.PriceCheckDayOfWeek;
        settings.BlockedPriceCheckDays = request.BlockedPriceCheckDays;
        settings.Theme = request.Theme;
        settings.EmailAlertsEnabled = request.EmailAlertsEnabled;
        settings.SmsAlertsEnabled = request.SmsAlertsEnabled;
        settings.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return ToResponse(settings);
    }

    private async Task<Models.UserSettings> InitialiseUserSettings(
        string userId,
        CancellationToken cancellationToken = default
    )
    {
        var settings = await _dbContext.UserSettings
            .FirstOrDefaultAsync(us => us.UserId == userId, cancellationToken);

        if (settings is not null) return settings;

        settings = new Models.UserSettings
        {
            UserId = userId,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        _dbContext.UserSettings.Add(settings);
        return settings;
    }

    private static UserSettingsResponse ToResponse(Models.UserSettings settings)
    {
        return new UserSettingsResponse(
        settings.DefaultStore,
        settings.Currency,
        settings.PriceCheckFrequency,
        settings.PriceCheckTimeOfDay,
        settings.PriceCheckTimezone,
        settings.PriceCheckDayOfWeek,
        settings.BlockedPriceCheckDays,
        settings.Theme,
        settings.EmailAlertsEnabled,
        settings.SmsAlertsEnabled
    );
    }
}
