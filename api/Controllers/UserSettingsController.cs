
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Services.UserSettings;
using api.DTOs.UserSettings;
using api.Enums;
using api.Extensions;

namespace api.Controllers;

[ApiController]
[Authorize]
[Route("api/user-settings")]
public class UserSettingsController : ControllerBase
{
    private readonly IUserSettingsService _userSettingsService;

    public UserSettingsController(IUserSettingsService userSettingsService)
    {
        _userSettingsService = userSettingsService;
    }

    [HttpGet]
    public async Task<ActionResult<UserSettingsResponse>> GetUserSettings(
        CancellationToken cancellationToken = default
    )
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        var userSettings = await _userSettingsService.GetUserSettingsAsync(
            userId, 
            cancellationToken
        );

        return Ok(userSettings);
    }

    [HttpPut]
    public async Task<ActionResult<UserSettingsResponse>> UpdateUserSettings(
        [FromBody] UpdateUserSettingsRequest body,
        CancellationToken cancellationToken = default
    )
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        var userSettings = await _userSettingsService.UpdateUserSettingsAsync(
            userId,
            body,
            cancellationToken
        );

        return Ok(userSettings);
    }
}