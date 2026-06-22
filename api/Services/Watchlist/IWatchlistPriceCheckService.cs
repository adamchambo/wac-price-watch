using api.Enums;

namespace api.Services.Watchlist;

public interface IWatchlistPriceCheckService
{
    Task<Guid> StartWatchlistPriceCheckAsync(
        Store store,
        CancellationToken cancellationToken = default
    );
}
