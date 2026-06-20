using api.Enums;

namespace api.Models;

public class StoreProduct
{
    public Guid Id { get; set; }

    public Store Store { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Brand { get; set; }

    public string? SizeLabel { get; set; }

    public string? ImageUrl { get; set; }

    public string ProductUrl { get; set; } = string.Empty;

    public string? StoreSku { get; set; }

    public decimal? CurrentPrice { get; set; }

    public bool IsOnSpecial { get; set; }

    public ProductStatus Status { get; set; } = ProductStatus.Active;

    public bool IsRemoved { get; set; }

    public int MissingScrapeCount { get; set; }

    public DateTime? LastSeenInSitemapAt { get; set; }

    public DateTime? RemovedAt { get; set; }

    public ScrapeStatus ScrapeStatus { get; set; } = ScrapeStatus.NotChecked;

    public string? LastScrapeError { get; set; }

    public DateTime? LastSyncedAt { get; set; }

    public DateTime? LastCheckedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public List<WatchlistItem> WatchlistItems { get; set; } = [];

    public List<WatchlistItemMatch> WatchlistItemMatches { get; set; } = [];

    public List<PriceSnapshot> PriceSnapshots { get; set; } = [];

    public List<ScrapeTask> ScrapeTasks { get; set; } = [];
}
