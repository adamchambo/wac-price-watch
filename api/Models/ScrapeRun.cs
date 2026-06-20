using api.Enums;

namespace api.Models;

public class ScrapeRun
{
    public Guid Id { get; set; }

    public Store? Store { get; set; }

    public ScrapeRunType Type { get; set; }

    public ScrapeRunStatus Status { get; set; } = ScrapeRunStatus.Queued;

    public DateTime? StartedAt { get; set; }

    public DateTime? FinishedAt { get; set; }

    public string? ErrorMessage { get; set; }

    public int ProductsSeen { get; set; }

    public int ProductsUpdated { get; set; }

    public int ProductsFailed { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<ScrapeTask> Tasks { get; set; } = [];

    public List<PriceSnapshot> PriceSnapshots { get; set; } = [];
}
