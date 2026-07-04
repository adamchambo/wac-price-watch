using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Services.Watchlist;
using api.DTOs.Watchlists;
using api.Enums;

namespace api.Controllers;

[ApiController]
[Authorize]
[Route("api/watchlists")]
public class WatchlistController : ControllerBase
{
    private readonly IWatchlistService _watchlistService;

    public WatchlistController(IWatchlistService watchlistService)
    {
        _watchlistService = watchlistService;
    }

    [HttpGet("{store}/items")]
    public async Task<ActionResult<WatchlistResponse>> GetWatchlist(
        [FromRoute] Store store,
        [FromQuery] string? searchTerm,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default
    )
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var watchlsit = await _watchlistService.GetWatchlistAsync(
            userId, 
            store,
            searchTerm,
            page,
            pageSize,
            cancellationToken
        );

        return Ok(watchlsit);
    }

    [HttpGet("{store}/items/{watchlistItemId}")]
    public async Task<ActionResult<WatchlistItemResponse>> GetWatchlistItem(
        [FromRoute] Store store,
        [FromRoute] Guid watchlistItemId,
        CancellationToken cancellationToken = default
    )
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var item = await _watchlistService.GetWatchlistItemAsync(
            userId,
            watchlistItemId,
            cancellationToken
        );

        return Ok(item);
    }

    [HttpPost("{store}/items")]
    public async Task<ActionResult<WatchlistItemResponse>> AddWatchlistItem(
        [FromRoute] Store store,
        [FromBody] AddWatchlistItemRequest body,
        CancellationToken cancellationToken = default
    )
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var item = await _watchlistService.AddWatchlistItemAsync(
            userId,
            store,
            body,
            cancellationToken
        );

        return Ok(item);
    }

    [HttpDelete("items/{watchlistItemId:guid}")]
    public async Task<IActionResult> RemoveWatchlistItem(
        [FromRoute] Guid watchlistItemid,
        CancellationToken cancellationToken = default
    )
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        await _watchlistService.RemoveWatchlistItemAsync(
            userId,
            watchlistItemid,
            cancellationToken
        );

        return NoContent();
    }
}

