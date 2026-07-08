using api.Data;
using api.Enums;
using api.Models;
using api.Options;
using api.Services.Scraping;
using api.Services.Sitemap;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace api.Services.Catalog;

public class CatalogSyncService : ICatalogSyncService
{
    private readonly AppDbContext _dbContext;
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly ISitemapService _sitemapService;
    private readonly CatalogSyncOptions _catalogSyncOptions;

    public CatalogSyncService(
        AppDbContext dbContext,
        IBackgroundJobClient backgroundJobClient,
        ISitemapService sitemapService,
        IOptions<CatalogSyncOptions> catalogSyncOptions
    )
    {
        _dbContext = dbContext;
        _backgroundJobClient = backgroundJobClient;
        _sitemapService = sitemapService;
        _catalogSyncOptions = catalogSyncOptions.Value;
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

        _dbContext.ScrapeRuns.Add(scrapeRun);
        _dbContext.ScrapeTasks.AddRange(scrapeTasks);

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

    public async Task<int> QueueCatalogSitemapSyncAsync(
        Store store,
        CancellationToken cancellationToken = default
    )
    {
        var sitemapConfig = GetSitemapConfig(store);

        var discovery = await _sitemapService.DiscoverProductUrlsAsync(
            sitemapConfig.SitemapUrl,
            sitemapConfig.ProductUrlPattern,
            sitemapConfig.MaxDepth,
            sitemapConfig.MaxUrls,
            cancellationToken
        );

        var now = DateTime.UtcNow;
        var productUrls = discovery.ProductUrls.ToList();
        var existingProducts = await _dbContext.StoreProducts
            .Where(p => p.Store == store && productUrls.Contains(p.ProductUrl))
            .ToDictionaryAsync(p => p.ProductUrl, StringComparer.OrdinalIgnoreCase, cancellationToken);

        var products = productUrls.Select(url =>
        {
            if (existingProducts.TryGetValue(url, out var existingProduct))
            {
                existingProduct.LastSeenInSitemapAt = now;
                existingProduct.IsRemoved = false;
                existingProduct.UpdatedAt = now;

                return existingProduct;
            }

            var product = new StoreProduct
            {
                Store = store,
                ProductUrl = url,
                LastSeenInSitemapAt = now,
                CreatedAt = now,
                UpdatedAt = now
            };

            _dbContext.StoreProducts.Add(product);

            return product;
        }).ToList();

        var scrapeRun = new ScrapeRun
        {
            Store = store,
            Type = ScrapeRunType.CatalogSync,
            Status = ScrapeRunStatus.Queued,
            ProductsSeen = products.Count,
            CreatedAt = now
        };

        var scrapeTasks = products.Select(product => new ScrapeTask
        {
            ScrapeRun = scrapeRun,
            StoreProduct = product,
            ProductUrl = product.ProductUrl,
            Store = store,
            Status = ScrapeTaskStatus.Queued,
            QueuedAt = now,
            CreatedAt = now,
            UpdatedAt = now
        }).ToList();

        _dbContext.ScrapeRuns.Add(scrapeRun);
        _dbContext.ScrapeTasks.AddRange(scrapeTasks);

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

    private CatalogSitemapOptions GetSitemapConfig(Store store)
    {
        if (_catalogSyncOptions.Sitemaps.TryGetValue(store.ToString(), out var sitemapConfig))
        {
            return sitemapConfig;
        }

        throw new InvalidOperationException($"No catalog sitemap configured for store: {store}");
    }
}
