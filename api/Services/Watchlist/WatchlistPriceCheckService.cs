using api.Data;
using api.Enums;
using api.Models;
using api.Services.Scraping;
using Hangfire;
using Microsoft.EntityFrameworkCore;

namespace api.Services.Watchlist;

public class WatchlistPriceCheckService : IWatchlistPriceCheckService
{
    private readonly AppDbContext _dbContext;
    private readonly IBackgroundJobClient _backgroundJobClient;

    public WatchlistPriceCheckService(
        AppDbContext dbContext,
        IBackgroundJobClient backgroundJobClient
    )
    {
        _dbContext = dbContext;
        _backgroundJobClient = backgroundJobClient;
    }
    public async Task<int> QueueWatchlistPriceCheckAsync(
        Store store,
        CancellationToken cancellationToken = default
    )
    {
        var now = DateTime.Now;

        var watchlistItems = await _dbContext.WatchlistItems
            .Where(item => item.Watchlist!.Store == store)
            .Where(item => item.BaseStoreProduct != null)
            .Select(item => item.BaseStoreProduct!)
            .Distinct()
            .ToListAsync(cancellationToken);


        var scrapeRun = new ScrapeRun
        {
            Store = store,
            Type = ScrapeRunType.WatchlistPriceCheck,
            Status = ScrapeRunStatus.Queued,
            ProductsSeen = watchlistItems.Count,
            CreatedAt = DateTime.UtcNow 
        };

        var scrapeTasks = watchlistItems.Select(product => new ScrapeTask
        {
            ScrapeRun = scrapeRun,
            StoreProductId = product.Id,
            ProductUrl = product.ProductUrl,
            Store = product.Store,
            Status = ScrapeTaskStatus.Queued,
            QueuedAt = now,
            CreatedAt = now,
            UpdatedAt = now
        }).ToList();

        await _dbContext.SaveChangesAsync(cancellationToken);

        foreach (var task in scrapeTasks)
        {
            _backgroundJobClient.Enqueue<IProductScrapeService>(
                service => service.ProcessScrapeTaskAsync(
                    task.Id,
                    CancellationToken.None
                )
            );
        }
        return scrapeTasks.Count;
    }
}
