using api.Enums;

namespace api.Services.Catalog;

public interface ICatalogSyncService
{
    Task<Guid> StartCatalogSyncAsync(
        Store store,
        CancellationToken cancellationToken = default
    );
}
