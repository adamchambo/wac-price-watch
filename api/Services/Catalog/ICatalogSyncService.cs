using api.Enums;

namespace api.Services.Catalog;

public interface ICatalogSyncService
{
    Task<int> QueueCatalogSyncAsync(Store store, CancellationToken cancellationToken = default);
}
