using api.DTOs.Catalog;
using api.Data;
using api.Models;
using api.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;

namespace api.Services.Catalog;

public class CatalogService : ICatalogService
{
    private readonly AppDbContext _dbContext;
    public CatalogService(AppDbContext dbContext) {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<CatalogProductResponse>> GetCatalogProductsAsync(
        Store store,
        string? searchTerm,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default
    )
    {
        var query = _dbContext.StoreProducts
            .Where(p => p.Store == store && !p.IsRemoved);

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(p =>
                p.Name.Contains(searchTerm) || 
                (p.Brand != null && p.Brand.Contains(searchTerm))
            );
        }
        return await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => ToResponseProduct(p))
            .ToListAsync(cancellationToken);
    }

    public async Task<CatalogProductDetailsResponse?> GetCatalogProductByIdAsync(
        Guid productId,
        CancellationToken cancellationToken = default
    )
    {
        var productDetail = await _dbContext.StoreProducts
        .FirstOrDefaultAsync(p => p.Id == productId);
        
        if (productDetail is null) return null;
        return ToResponseDetail(productDetail);
    }

    private static CatalogProductResponse ToResponseProduct(StoreProduct product)
    {
        return new CatalogProductResponse(
            product.Id,
            product.Store,
            product.Name,
            product.Brand,
            product.SizeLabel,
            product.ImageUrl,
            product.CurrentPrice,
            product.IsOnSpecial,
            product.Status,
            false
        );
    }

    private static CatalogProductDetailsResponse ToResponseDetail(StoreProduct product)
    {
        return new CatalogProductDetailsResponse(
            product.Id,
            product.Store,
            product.Name,
            product.Brand,
            product.SizeLabel,
            product.ImageUrl,
            product.ProductUrl,
            product.StoreSku,
            product.CurrentPrice,
            product.IsOnSpecial,
            product.Status,
            product.LastCheckedAt,
            product.PriceSnapshots
                .OrderByDescending(snapshot => snapshot.CapturedAt)
                .Select(snapshot => new PriceSnapshotResponse(
                    snapshot.Id,
                    snapshot.Price,
                    snapshot.Currency,
                    snapshot.UnitPrice,
                    snapshot.WasOnSpecial,
                    snapshot.AvailabilityStatus,
                    snapshot.CapturedAt
                ))
                .ToList()
        );
    }
}
