
using api.Data;
using api.DTOs.Watchlists;
using api.Enums;
using api.Mappers;
using api.Models;
using api.Scraping;
using Microsoft.EntityFrameworkCore;

namespace api.Services.Watchlist;

public class WatchlistService : IWatchlistService
{
    private readonly AppDbContext _dbContext;
    private readonly StoreScraperResolver _storeScraperResolver;

    public WatchlistService(
        AppDbContext dbContext,
        StoreScraperResolver storeScraperResolver
    )
    {
        _dbContext = dbContext;
        _storeScraperResolver = storeScraperResolver;
    }

    public async Task<WatchlistResponse?> GetWatchlistAsync(
        string userId,
        Store store,
        string? searchTerm,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default
    )
    {
        var watchlist = await _dbContext.Watchlists
            .Where(w => w.UserId == userId && w.Store == store)
            .FirstOrDefaultAsync(cancellationToken);
        
        if (watchlist is null) return null;

        var itemsQuery = _dbContext.WatchlistItems
            .Where(i => 
                i.WatchlistId == watchlist.Id &&
                i.RemovedAt == null
            );

        if (!string.IsNullOrEmpty(searchTerm))
        {
            itemsQuery = itemsQuery
                .Where(i => i.DisplayName.Contains(searchTerm));
        }

        var items = await itemsQuery
            .Include(i => i.BaseStoreProduct)
                .ThenInclude(product => product!.Categories)
                    .ThenInclude(category => category.ProductCategory)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        watchlist.Items = items;

        return WatchlistMapper.ToWatchlistResponse(watchlist);
    }

    public async Task<WatchlistItemResponse?> GetWatchlistItemAsync(
        string userId,
        Guid watchlistItemId,
        CancellationToken cancellationToken = default
    )
    {
        var watchlistItem = await _dbContext.WatchlistItems
            .Where(i =>
                i.Id == watchlistItemId &&
                i.Watchlist!.UserId == userId &&
                i.RemovedAt == null
            )
            .Include(i => i.BaseStoreProduct)
                .ThenInclude(product => product!.Categories)
                    .ThenInclude(category => category.ProductCategory)
            .Include(i => i.Matches)
                .ThenInclude(m => m.StoreProduct)
                    .ThenInclude(product => product!.Categories)
                        .ThenInclude(category => category.ProductCategory)
            .FirstOrDefaultAsync(cancellationToken);

        if (watchlistItem is null) return null;
        return WatchlistMapper.ToWatchlistItemResponse(watchlistItem);
    }

    public async Task<WatchlistItemResponse?> AddWatchlistItemAsync(
        string userId,
        Store store,
        AddWatchlistItemRequest request,
        CancellationToken cancellationToken = default
    )
    {
        ArgumentNullException.ThrowIfNull(request, nameof(request));

        var watchlist = await GetOrCreateWatchlistAsync(userId, store, cancellationToken);

        var newItem = new WatchlistItem
        {
            Id = Guid.NewGuid(),
            WatchlistId = watchlist.Id, // This should be the ID of the user's watchlist for the specified store
            BaseStoreProductId = request.StoreProductId,
            DisplayName = request.DisplayName,
            AddedAt = DateTime.UtcNow
        };

        if (newItem is null) return null;

        _dbContext.WatchlistItems.Add(newItem);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return WatchlistMapper.ToWatchlistItemResponse(newItem);
    }

    public async Task<WatchlistItemResponse?> AddWatchlistItemByUrlAsync(
        string userId,
        Store store,
        AddWatchlistItemByUrlRequest request,
        CancellationToken cancellationToken = default
    )
    {
        ArgumentNullException.ThrowIfNull(request, nameof(request));

        if (string.IsNullOrWhiteSpace(request.ProductUrl))
        {
            throw new ArgumentException("ProductUrl is required.", nameof(request));
        }

        var now = DateTime.UtcNow;
        var productUrl = request.ProductUrl.Trim();
        var scraper = _storeScraperResolver.Resolve(store);
        var scrapedProduct = await scraper.ScrapeProductAsync(productUrl);
        var watchlist = await GetOrCreateWatchlistAsync(userId, store, cancellationToken);

        var product = await _dbContext.StoreProducts
            .FirstOrDefaultAsync(
                p => p.Store == store && p.ProductUrl == productUrl,
                cancellationToken
            );

        if (product is null)
        {
            product = new StoreProduct
            {
                Store = store,
                ProductUrl = productUrl,
                CreatedAt = now
            };

            _dbContext.StoreProducts.Add(product);
        }

        product.Name = scrapedProduct.Name;
        product.Brand = scrapedProduct.Brand;
        product.ImageUrl = scrapedProduct.ImageUrl;
        product.StoreSku = scrapedProduct.StoreSku;
        product.CurrentPrice = scrapedProduct.CurrentPrice;
        product.IsOnSpecial = scrapedProduct.IsOnSpecial;
        product.LastSyncedAt = scrapedProduct.ScrapedAt;
        product.LastCheckedAt = scrapedProduct.ScrapedAt;
        product.UpdatedAt = now;

        await _dbContext.SaveChangesAsync(cancellationToken);
        await ReplaceProductCategoriesAsync(product, store, scrapedProduct.CategoryTrail, cancellationToken);

        var watchlistItem = await _dbContext.WatchlistItems
            .Include(item => item.BaseStoreProduct)
                .ThenInclude(product => product!.Categories)
                    .ThenInclude(category => category.ProductCategory)
            .FirstOrDefaultAsync(
                item =>
                    item.WatchlistId == watchlist.Id &&
                    item.BaseStoreProductId == product.Id,
                cancellationToken
            );

        if (watchlistItem is not null)
        {
            watchlistItem.RemovedAt = null;
            watchlistItem.DisplayName = request.DisplayName ?? scrapedProduct.Name;
            watchlistItem.BaseStoreProduct = product;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return WatchlistMapper.ToWatchlistItemResponse(watchlistItem);
        }

        watchlistItem = new WatchlistItem
        {
            Id = Guid.NewGuid(),
            WatchlistId = watchlist.Id,
            BaseStoreProductId = product.Id,
            BaseStoreProduct = product,
            DisplayName = request.DisplayName ?? scrapedProduct.Name,
            AddedAt = now
        };

        _dbContext.WatchlistItems.Add(watchlistItem);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return WatchlistMapper.ToWatchlistItemResponse(watchlistItem);
    }

    public async Task RemoveWatchlistItemAsync(
        string userId,
        Guid watchlistItemId,
        CancellationToken cancellationToken = default
    )
    {
        var watchlistItem = await _dbContext.WatchlistItems
            .Where(i =>
                i.Id == watchlistItemId &&
                i.Watchlist!.UserId == userId &&
                i.RemovedAt == null
            )
            .FirstOrDefaultAsync(cancellationToken);

        if (watchlistItem is null) return;

        watchlistItem.RemovedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task<Models.Watchlist> GetOrCreateWatchlistAsync(
        string userId,
        Store store,
        CancellationToken cancellationToken
    )
    {
        var watchlist = await _dbContext.Watchlists
            .FirstOrDefaultAsync(w => w.UserId == userId && w.Store == store, cancellationToken);

        if (watchlist is not null)
        {
            return watchlist;
        }

        watchlist = new Models.Watchlist
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Store = store,
            Name = $"{store} Watchlist",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.Watchlists.Add(watchlist);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return watchlist;
    }

    private async Task ReplaceProductCategoriesAsync(
        StoreProduct product,
        Store store,
        IReadOnlyList<string> categoryTrail,
        CancellationToken cancellationToken
    )
    {
        var existingLinks = await _dbContext.StoreProductCategories
            .Where(category => category.StoreProductId == product.Id)
            .ToListAsync(cancellationToken);

        _dbContext.StoreProductCategories.RemoveRange(existingLinks);

        ProductCategory? parentCategory = null;
        var depth = 0;

        foreach (var rawCategoryName in categoryTrail)
        {
            var categoryName = rawCategoryName.Trim();

            if (string.IsNullOrWhiteSpace(categoryName))
            {
                continue;
            }

            var normalizedName = NormalizeCategoryName(categoryName);
            var parentCategoryId = parentCategory?.Id;
            var category = await _dbContext.ProductCategories
                .FirstOrDefaultAsync(
                    existingCategory =>
                        existingCategory.Store == store &&
                        existingCategory.ParentCategoryId == parentCategoryId &&
                        existingCategory.NormalizedName == normalizedName,
                    cancellationToken
                );

            if (category is null)
            {
                category = new ProductCategory
                {
                    Id = Guid.NewGuid(),
                    Store = store,
                    Name = categoryName,
                    NormalizedName = normalizedName,
                    ParentCategoryId = parentCategoryId
                };

                _dbContext.ProductCategories.Add(category);
                await _dbContext.SaveChangesAsync(cancellationToken);
            }

            _dbContext.StoreProductCategories.Add(new StoreProductCategory
            {
                StoreProductId = product.Id,
                ProductCategoryId = category.Id,
                Depth = depth
            });

            parentCategory = category;
            depth++;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static string NormalizeCategoryName(string categoryName)
    {
        return categoryName.Trim().ToUpperInvariant();
    }
}
