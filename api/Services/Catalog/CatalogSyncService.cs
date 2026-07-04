using api.Data;
using api.Enums;
using api.Models;
using api.Services.Scraping;
using Hangfire;
using Microsoft.EntityFrameworkCore;

namespace api.Services.Catalog;

public class CatalogSyncService : ICatalogSyncService
{
    private readonly AppDbContext _dbContext;
    private readonly IBackgroundJobClient _backgroundJobClient;

    public CatalogSyncService(
        AppDbContext dbContext,
        IBackgroundJobClient backgroundJobClient
    )
    {
        _dbContext = dbContext;
        _backgroundJobClient = backgroundJobClient;
    }

    public async Task<int> QueueCatalogSyncAsync(Store store, CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        var products = await _dbContext.StoreProducts
            .Where(p => p.Store == store && !p.IsRemoved)
            .ToListAsync(cancellationToken);

        var scrapeRun = new ScrapeRun
        {
            Store = store,
            Type = ScrapeRunType.CatalogSync,
            Status = ScrapeRunStatus.Queued,
            ProductsSeen = products.Count,
            CreatedAt = DateTime.UtcNow
        };

        var scrapeTasks = products.Select(p => new ScrapeTask
        {
            ScrapeRun = scrapeRun,
            StoreProductId = p.Id,
            ProductUrl = p.ProductUrl,
            Store = p.Store,
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
