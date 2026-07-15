using api.Enums;

namespace api.DTOs.Catalog;

public record CatalogProductResponse(
    Guid Id,
    Store Store,
    string Name,
    string? Brand,
    string? SizeLabel,
    string? ImageUrl,
    CatalogCategoryResponse? Category,
    IReadOnlyList<CatalogCategoryResponse> CategoryTrail,
    decimal? CurrentPrice,
    bool IsOnSpecial,
    ProductStatus Status,
    bool IsWatchlisted
);

public record CatalogCategoryResponse(
    Guid Id,
    string Name,
    int Depth
);
