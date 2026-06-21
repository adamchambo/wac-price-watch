using api.Enums;

namespace api.Models;

public class StoreProfile
{
    public Guid Id { get; set; }

    public Store Store { get; set; }

    public string Name { get; set; } = string.Empty;

    public string SitemapUrl { get; set; } = string.Empty;

    public string ProductUrlPattern { get; set; } = string.Empty;

    public bool IsEnabled { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
