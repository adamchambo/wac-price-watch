namespace api.DTOs.Scraping;

public record ScrapedStoreProduct(
    string Name,
    string? Brand,
    string? ImageUrl,
    string ProductUrl,
    string? StoreSku,
    IReadOnlyList<string> CategoryTrail,
    decimal? CurrentPrice,
    bool IsOnSpecial,
    bool IsAvailable,
    DateTime ScrapedAt
);
