using api.Enums;

namespace api.Services.Watchlist;

public interface IWatchlistPriceCheckService
{
    Task<int> QueueWatchlistPriceCheckAsync(
        Store store,
        CancellationToken cancellationToken = default
    );
}
    
