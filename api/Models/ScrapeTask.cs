using api.Enums;

namespace api.Models;

public class ScrapeTask
{
    public Guid Id { get; set; }

    public Guid ScrapeRunId { get; set; }

    public Guid StoreProductId { get; set; }

    public string ProductUrl { get; set; } = string.Empty;

    public Store Store { get; set; }

    public ScrapeTaskStatus Status { get; set; } = ScrapeTaskStatus.Queued;

    public int Attempts { get; set; }

    public string? LastError { get; set; }

    public DateTime QueuedAt { get; set; }

    public DateTime? StartedAt { get; set; }

    public DateTime? FinishedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public ScrapeRun? ScrapeRun { get; set; }

    public StoreProduct StoreProduct { get; set; } = null!;
}
