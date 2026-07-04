namespace api.DTOs.Watchlists;

public record AddWatchlistItemRequest(
    Guid StoreProductId,
    string DisplayName
);
