using api.DTOs.Catalog;
using api.Data;
using api.Enums;
using api.Mappers;
using Microsoft.EntityFrameworkCore;

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
            .Select(p => CatalogMapper.ToCatalogProductResponse(p))
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
        return CatalogMapper.ToCatalogProductDetailsResponse(productDetail);
    }
}
