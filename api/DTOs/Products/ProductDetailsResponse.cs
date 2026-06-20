using api.Enums;

namespace api.DTOs.Products;

public record ProductDetailsResponse(
    Guid Id,
    Store Store,
    string Name,
    string? Brand,
    string? SizeLabel,
    string? ImageUrl,
    string ProductUrl,
    string? StoreSku,
    decimal? CurrentPrice,
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
