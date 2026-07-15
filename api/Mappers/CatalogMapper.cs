using api.DTOs.Catalog;
using api.Models;

namespace api.Mappers;

public static class CatalogMapper
{
    public static CatalogProductResponse ToCatalogProductResponse(
        StoreProduct product,
        bool isWatchlisted = false
    )
    {
        return new CatalogProductResponse(
            product.Id,
            product.Store,
            product.Name,
            product.Brand,
            product.SizeLabel,
            product.ImageUrl,
            GetLeafCategory(product),
            GetCategoryTrail(product),
            product.CurrentPrice,
            product.IsOnSpecial,
            product.Status,
            isWatchlisted
        );
    }

    public static CatalogProductDetailsResponse ToCatalogProductDetailsResponse(StoreProduct product)
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
            GetLeafCategory(product),
            GetCategoryTrail(product),
            product.CurrentPrice,
            product.IsOnSpecial,
            product.Status,
            product.LastCheckedAt,
            product.PriceSnapshots
                .OrderByDescending(snapshot => snapshot.CapturedAt)
                .Select(ToPriceSnapshotResponse)
                .ToList()
        );
    }

    private static CatalogCategoryResponse? GetLeafCategory(StoreProduct product)
    {
        return product.Categories
            .OrderByDescending(category => category.Depth)
            .Select(ToCatalogCategoryResponse)
            .FirstOrDefault();
    }

    private static IReadOnlyList<CatalogCategoryResponse> GetCategoryTrail(StoreProduct product)
    {
        return product.Categories
            .OrderBy(category => category.Depth)
            .Select(ToCatalogCategoryResponse)
            .ToList();
    }

    private static CatalogCategoryResponse ToCatalogCategoryResponse(StoreProductCategory category)
    {
        return new CatalogCategoryResponse(
            category.ProductCategoryId,
            category.ProductCategory?.Name ?? string.Empty,
            category.Depth
        );
    }

    private static PriceSnapshotResponse ToPriceSnapshotResponse(PriceSnapshot snapshot)
    {
        return new PriceSnapshotResponse(
            snapshot.Id,
            snapshot.Price,
            snapshot.Currency,
            snapshot.UnitPrice,
            snapshot.WasOnSpecial,
            snapshot.AvailabilityStatus,
            snapshot.CapturedAt
        );
    }
}
