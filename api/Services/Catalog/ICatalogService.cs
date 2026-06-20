using api.DTOs.Catalog;
using api.Enums;

namespace api.Services.Catalog;

public interface ICatalogService
{
    Task<IReadOnlyList<CatalogProductResponse>> GetCatalogProductsAsync(
        Store store,
        string? searchTerm,
        int page,
        int pageSize
    );

    Task<CatalogProductDetailsResponse?> GetCatalogProductByIdAsync(Guid productId);
}
