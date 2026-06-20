using api.DTOs.Products;

namespace api.DTOs.Watchlists;

public record WatchlistItemResponse(
    Guid Id,
    Guid BaseStoreProductId,
    string DisplayName,
    ProductResponse BaseProduct,
    IReadOnlyList<WatchlistItemMatchResponse> Matches,
    DateTime AddedAt
);

public record WatchlistItemMatchResponse(
    Guid Id,
    Guid StoreProductId,
    ProductResponse Product,
    DateTime CreatedAt
);
