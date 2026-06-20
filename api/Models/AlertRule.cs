using api.Enums;

namespace api.Models;

public class AlertRule
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public Guid WatchlistItemId { get; set; }

    public AlertRuleType Type { get; set; }

    public decimal? TargetPrice { get; set; }

    public bool Enabled { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public WatchlistItem? WatchlistItem { get; set; }
}
