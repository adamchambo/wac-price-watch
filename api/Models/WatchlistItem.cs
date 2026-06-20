namespace api.Models;

public class WatchlistItem
{
    public Guid Id { get; set; }

    public Guid WatchlistId { get; set; }

    public Guid BaseStoreProductId { get; set; }

    public string DisplayName { get; set; } = string.Empty;

    public DateTime AddedAt { get; set; }

    public DateTime? RemovedAt { get; set; }

    public Watchlist? Watchlist { get; set; }

    public StoreProduct? BaseStoreProduct { get; set; }

    public List<WatchlistItemMatch> Matches { get; set; } = [];

    public List<Notification> Notifications { get; set; } = [];

    public List<AlertRule> AlertRules { get; set; } = [];
}
