using api.DTOs.Watchlists;
using api.Models;

namespace api.Mappers;

public static class WatchlistMapper
{
    public static WatchlistResponse ToWatchlistResponse(Watchlist watchlist)
    {
        return new WatchlistResponse(
            watchlist.Id,
            watchlist.Store,
            watchlist.Name,
            watchlist.Items.Select(ToWatchlistItemResponse).ToList()
        );
    }

    public static WatchlistItemResponse ToWatchlistItemResponse(WatchlistItem item)
    {
        return new WatchlistItemResponse(
            item.Id,
            item.BaseStoreProductId,
            item.DisplayName,
            CatalogMapper.ToCatalogProductResponse(item.BaseStoreProduct!, true),
            item.Matches.Select(ToWatchlistItemMatchResponse).ToList(),
            item.AddedAt
        );
    }

    private static WatchlistItemMatchResponse ToWatchlistItemMatchResponse(WatchlistItemMatch match)
    {
        return new WatchlistItemMatchResponse(
            match.Id,
            match.StoreProductId,
            CatalogMapper.ToCatalogProductResponse(match.StoreProduct!, true),
            match.CreatedAt
        );
    }
}
