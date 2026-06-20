using api.Enums;

namespace api.DTOs.Products;

public record ProductResponse(
    Guid Id,
    Store Store,
    string Name,
    string? Brand,
    string? SizeLabel,
    string? ImageUrl,
    decimal? CurrentPrice,
    ProductStatus Status,
    bool IsWatchlisted
);
