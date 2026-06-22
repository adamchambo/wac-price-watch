using api.DTOs.UserSettings;

namespace api.Services.UserSettings;

public interface IUserSettingsService
{
    Task<UserSettingsResponse> GetUserSettingsAsync(
        string userId,
        CancellationToken cancellationToken = default
    );

    Task<UserSettingsResponse> UpdateUserSettingsAsync(
        string userId, 
        UpdateUserSettingsRequest request,
        CancellationToken cancellationToken = default
    );
}
