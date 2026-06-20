using api.DTOs.Catalog;
using api.Enums;

namespace api.Services.Catalog;

public class CatalogService : ICatalogService
{
    public Task<IReadOnlyList<CatalogProductResponse>> GetCatalogProductsAsync(
        Store store,
        string? searchTerm,
        int page,
        int pageSize
    )
    {
        throw new NotImplementedException();
    }

    public Task<CatalogProductDetailsResponse?> GetCatalogProductByIdAsync(Guid productId)
    {
        throw new NotImplementedException();
    }
}
