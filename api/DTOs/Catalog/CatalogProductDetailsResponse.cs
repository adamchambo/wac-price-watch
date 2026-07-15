using api.Enums;

namespace api.DTOs.Catalog;

public record CatalogProductDetailsResponse(
    Guid Id,
    Store Store,
    string Name,
    string? Brand,
    string? SizeLabel,
    string? ImageUrl,
    string ProductUrl,
    string? StoreSku,
    CatalogCategoryResponse? Category,
    IReadOnlyList<CatalogCategoryResponse> CategoryTrail,
    decimal? CurrentPrice,
    bool IsOnSpecial,
    ProductStatus Status,
    DateTime? LastCheckedAt,
    IReadOnlyList<PriceSnapshotResponse> PriceHistory
);

public record PriceSnapshotResponse(
    Guid Id,
    decimal? Price,
    string Currency,
    decimal? UnitPrice,
    bool WasOnSpecial,
    ProductStatus AvailabilityStatus,
    DateTime CapturedAt
);
