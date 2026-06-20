namespace api.Models;

public class WatchlistItemMatch
{
    public Guid Id { get; set; }

    public Guid WatchlistItemId { get; set; }

    public Guid StoreProductId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public WatchlistItem? WatchlistItem { get; set; }

    public StoreProduct? StoreProduct { get; set; }
}
