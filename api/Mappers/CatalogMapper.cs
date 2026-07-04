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
