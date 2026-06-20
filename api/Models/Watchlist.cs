using api.Enums;

namespace api.Models;

public class Watchlist
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public Store Store { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<WatchlistItem> Items { get; set; } = [];
}