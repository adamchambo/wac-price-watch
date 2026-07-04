namespace api.DTOs.Scraping;

public record ScrapedStoreProduct(
    string Name,
    string? Brand,
    string? SizeLabel,
    string? ImageUrl,
    string ProductUrl,
    string? StoreSku,
    decimal? CurrentPrice,
    bool IsOnSpecial,
    bool IsAvailable,
    DateTime ScrapedAt
);