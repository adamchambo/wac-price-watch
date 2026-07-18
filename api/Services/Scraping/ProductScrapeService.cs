using api.Data;
using api.DTOs.Scraping;
using api.Models;
using api.Scraping;
using api.Enums;
using Microsoft.EntityFrameworkCore;

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

    public async Task ProcessScrapeTaskAsync(
        Guid scrapeTaskId,
        CancellationToken cancellationToken = default
    )
    {
        var scrapeTask = await LoadScrapeTaskAsync(scrapeTaskId, cancellationToken);

        // Hangfire may deliver a job more than once. A completed task and its price
        // snapshot must not be processed a second time.
        if (scrapeTask.Status == ScrapeTaskStatus.Succeeded)
        {
            await UpdateScrapeRunAsync(scrapeTask.ScrapeRunId, cancellationToken);
            return;
        }

        var startedAt = DateTime.UtcNow;
        MarkTaskStarted(scrapeTask, startedAt);
        await _dbContext.SaveChangesAsync(cancellationToken);

        try
        {
            var scraper = _storeScraperResolver.Resolve(scrapeTask.Store);
            var result = await scraper.ScrapeProductAsync(scrapeTask.ProductUrl);
            var completedAt = DateTime.UtcNow;

            ApplyScrapeResult(scrapeTask.StoreProduct, result, completedAt);
            _dbContext.PriceSnapshots.Add(
                CreatePriceSnapshot(scrapeTask.StoreProduct, result, scrapeTask, completedAt));
            MarkTaskSucceeded(scrapeTask, completedAt);

            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (Exception exception)
        {
            var failedAt = DateTime.UtcNow;
            MarkTaskFailed(scrapeTask, exception, failedAt);

            // Persist the failure before rethrowing so Hangfire can retry while the
            // application still retains the latest attempt and diagnostic details.
            await _dbContext.SaveChangesAsync(CancellationToken.None);
            await UpdateScrapeRunAsync(scrapeTask.ScrapeRunId, CancellationToken.None);
            throw;
        }

        // Keep run aggregation outside the scrape failure handler. A transient
        // summary-update error must not turn a successfully persisted scrape into
        // a failed task; Hangfire can safely retry and repair the summary above.
        await UpdateScrapeRunAsync(scrapeTask.ScrapeRunId, cancellationToken);
    }

    private async Task<ScrapeTask> LoadScrapeTaskAsync(
        Guid scrapeTaskId,
        CancellationToken cancellationToken
    )
    {
        return await _dbContext.ScrapeTasks
            .Include(task => task.StoreProduct)
            .SingleOrDefaultAsync(task => task.Id == scrapeTaskId, cancellationToken)
            ?? throw new InvalidOperationException($"Scrape task not found: {scrapeTaskId}");
    }

    private void MarkTaskStarted(ScrapeTask scrapeTask, DateTime now)
    {
        scrapeTask.Status = ScrapeTaskStatus.Running;
        scrapeTask.Attempts++;
        scrapeTask.StartedAt = now;
        scrapeTask.FinishedAt = null;
        scrapeTask.LastError = null;
        scrapeTask.UpdatedAt = now;
    }

    private void ApplyScrapeResult(
        StoreProduct storeProduct,
        ScrapedStoreProduct result,
        DateTime now
    )
    {
        storeProduct.Name = result.Name;
        storeProduct.Brand = result.Brand;
        storeProduct.ImageUrl = result.ImageUrl;
        storeProduct.StoreSku = result.StoreSku;
        storeProduct.CurrentPrice = result.CurrentPrice;
        storeProduct.IsOnSpecial = result.IsOnSpecial;
        storeProduct.Status = result.IsAvailable
            ? ProductStatus.Active
            : ProductStatus.OutOfStock;
        storeProduct.IsRemoved = false;
        storeProduct.RemovedAt = null;
        storeProduct.MissingScrapeCount = 0;
        storeProduct.ScrapeStatus = ScrapeStatus.Succeeded;
        storeProduct.LastScrapeError = null;
        storeProduct.LastSyncedAt = result.ScrapedAt.ToUniversalTime();
        storeProduct.LastCheckedAt = now;
        storeProduct.UpdatedAt = now;
    }

    private PriceSnapshot CreatePriceSnapshot(
        StoreProduct storeProduct,
        ScrapedStoreProduct result,
        ScrapeTask scrapeTask,
        DateTime now
    )
    {
        return new PriceSnapshot
        {
            StoreProductId = storeProduct.Id,
            ScrapeRunId = scrapeTask.ScrapeRunId,
            Price = result.CurrentPrice,
            WasOnSpecial = result.IsOnSpecial,
            AvailabilityStatus = result.IsAvailable
                ? ProductStatus.Active
                : ProductStatus.OutOfStock,
            CapturedAt = result.ScrapedAt.ToUniversalTime()
        };
    }

    private void MarkTaskSucceeded(ScrapeTask scrapeTask, DateTime now)
    {
        scrapeTask.Status = ScrapeTaskStatus.Succeeded;
        scrapeTask.LastError = null;
        scrapeTask.FinishedAt = now;
        scrapeTask.UpdatedAt = now;
    }

    private void MarkTaskFailed(
        ScrapeTask scrapeTask,
        Exception exception,
        DateTime now
    )
    {
        scrapeTask.Status = ScrapeTaskStatus.Failed;
        scrapeTask.LastError = exception.ToString();
        scrapeTask.FinishedAt = now;
        scrapeTask.UpdatedAt = now;

        var storeProduct = scrapeTask.StoreProduct;
        storeProduct.MissingScrapeCount++;
        storeProduct.ScrapeStatus = ScrapeStatus.Failed;
        storeProduct.LastScrapeError = exception.Message;
        storeProduct.LastCheckedAt = now;
        storeProduct.UpdatedAt = now;
    }

    private async Task UpdateScrapeRunAsync(
        Guid scrapeRunId,
        CancellationToken cancellationToken)
    {
        var counts = await _dbContext.ScrapeTasks
            .Where(task => task.ScrapeRunId == scrapeRunId)
            .GroupBy(_ => 1)
            .Select(tasks => new
            {
                Succeeded = tasks.Count(task => task.Status == ScrapeTaskStatus.Succeeded),
                Failed = tasks.Count(task => task.Status == ScrapeTaskStatus.Failed),
                Active = tasks.Count(task =>
                    task.Status == ScrapeTaskStatus.Queued ||
                    task.Status == ScrapeTaskStatus.Running)
            })
            .SingleAsync(cancellationToken);

        var status = counts.Active > 0
            ? ScrapeRunStatus.Running
            : counts.Failed == 0
                ? ScrapeRunStatus.Succeeded
                : counts.Succeeded == 0
                    ? ScrapeRunStatus.Failed
                    : ScrapeRunStatus.Partial;

        var finishedAt = counts.Active == 0 ? DateTime.UtcNow : (DateTime?)null;

        await _dbContext.ScrapeRuns
            .Where(run => run.Id == scrapeRunId)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(run => run.Status, status)
                .SetProperty(run => run.ProductsUpdated, counts.Succeeded)
                .SetProperty(run => run.ProductsFailed, counts.Failed)
                .SetProperty(run => run.StartedAt, run => run.StartedAt ?? DateTime.UtcNow)
                .SetProperty(run => run.FinishedAt, finishedAt), cancellationToken);
    }
}
