
using api.DTOs.Watchlists;
using api.Enums;

namespace api.Services.Watchlist;

public interface IWatchlistService
{
    Task<WatchlistResponse> GetWatchlistAsync(
        string userId,
        Store store,
        CancellationToken cancellationToken = default
    );

    Task<WatchlistItemResponse> AddWatchlistItemAsync(
        string userId,
        Store store,
        AddWatchlistItemRequest request,
        CancellationToken cancellationToken = default
    );

    Task RemoveWatchlistItemAsync(
        string userId,
        Guid watchlistItemId,
        CancellationToken cancellationToken = default
    );
}