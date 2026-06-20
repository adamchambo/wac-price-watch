using api.DTOs.Catalog;

namespace api.DTOs.Watchlists;

public record WatchlistItemResponse(
    Guid Id,
    Guid BaseStoreProductId,
    string DisplayName,
    CatalogProductResponse BaseProduct,
    IReadOnlyList<WatchlistItemMatchResponse> Matches,
    DateTime AddedAt
);

public record WatchlistItemMatchResponse(
    Guid Id,
    Guid StoreProductId,
    CatalogProductResponse Product,
    DateTime CreatedAt
);
