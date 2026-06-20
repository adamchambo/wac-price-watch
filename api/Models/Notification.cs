using api.Enums;

namespace api.Models;

public class Notification
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public Guid? WatchlistItemId { get; set; }

    public Guid? StoreProductId { get; set; }

    public NotificationType Type { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public bool IsRead { get; set; }

    public DateTime CreatedAt { get; set; }

    public WatchlistItem? WatchlistItem { get; set; }

    public StoreProduct? StoreProduct { get; set; }
}
