using api.Enums;

namespace api.Models;

public class PriceSnapshot
{
    public Guid Id { get; set; }

    public Guid StoreProductId { get; set; }

    public Guid ScrapeRunId { get; set; }

    public decimal? Price { get; set; }

    public string Currency { get; set; } = "AUD";

    public decimal? UnitPrice { get; set; }

    public bool WasOnSpecial { get; set; }

    public ProductStatus AvailabilityStatus { get; set; }

    public DateTime CapturedAt { get; set; }

    public StoreProduct? StoreProduct { get; set; }

    public ScrapeRun? ScrapeRun { get; set; }
}
