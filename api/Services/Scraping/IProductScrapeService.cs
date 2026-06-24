
namespace api.Services.Scraping;

public interface IProductScrapeService
{
    Task ProcessScrapeTaskAsync(
        Guid scrapeTaskId,
        CancellationToken cancellationToken = default
    );
}