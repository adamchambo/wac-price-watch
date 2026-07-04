
using api.Data;
using api.DTOs.Watchlists;
using api.Enums;
using api.Mappers;
using Microsoft.EntityFrameworkCore;

namespace api.Services.Watchlist;

public class WatchlistService : IWatchlistService
{
    private readonly AppDbContext _dbContext;

    public WatchlistService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
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
            watchlist.Items = watchlist.Items
                .Where(i => i.DisplayName.Contains(searchTerm))
                .ToList();
        }

        var items = await itemsQuery
            .Include(i => i.BaseStoreProduct)
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
        var watchlistItem = await _dbContext.WatchlistItems.Where(i => i.Id == watchlistItemId)
            .Include(i => i.BaseStoreProduct)
            .Include(i => i.Matches)
                .ThenInclude(m => m.StoreProduct)
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

        var watchlist = await _dbContext.Watchlists
            .FirstOrDefaultAsync(w => w.UserId == userId && w.Store == store, cancellationToken);

        if (watchlist is null)
        {
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
        }

        Models.WatchlistItem newItem = new Models.WatchlistItem
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

    public async Task RemoveWatchlistItemAsync(
        string userId,
        Guid watchlistItemId,
        CancellationToken cancellationToken = default
    )
    {
        throw new NotImplementedException();
    }
}