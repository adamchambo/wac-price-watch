using api.Data;
using api.DTOs.Scraping;
using api.Models;
using api.Scraping;

namespace api.Services.Scraping;

public class ProductScrapeService : IProductScrapeService
{
    private readonly AppDbContext _dbContext;
    private readonly StoreScraperResolver _storeScraperResolver;

    public ProductScrapeService(
        AppDbContext dbContext,
        StoreScraperResolver storeScraperResolver
    )
    {
        _dbContext = dbContext;
        _storeScraperResolver = storeScraperResolver;
    }

    public Task ProcessScrapeTaskAsync(
        Guid scrapeTaskId,
        CancellationToken cancellationToken = default
    )
    {
        throw new NotImplementedException();
    }

    private Task<ScrapeTask> LoadScrapeTaskAsync(
        Guid scrapeTaskId,
        CancellationToken cancellationToken
    )
    {
        throw new NotImplementedException();
    }

    private void MarkTaskStarted(ScrapeTask scrapeTask, DateTime now)
    {
        throw new NotImplementedException();
    }

    private void ApplyScrapeResult(
        StoreProduct storeProduct,
        ScrapedStoreProduct result,
        DateTime now
    )
    {
        throw new NotImplementedException();
    }

    private PriceSnapshot CreatePriceSnapshot(
        StoreProduct storeProduct,
        ScrapedStoreProduct result,
        ScrapeTask scrapeTask,
        DateTime now
    )
    {
        throw new NotImplementedException();
    }

    private void MarkTaskSucceeded(ScrapeTask scrapeTask, DateTime now)
    {
        throw new NotImplementedException();
    }

    private void MarkTaskFailed(
        ScrapeTask scrapeTask,
        Exception exception,
        DateTime now
    )
    {
        throw new NotImplementedException();
    }
}
