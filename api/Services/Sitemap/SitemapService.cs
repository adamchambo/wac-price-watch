using api.DTOs.Sitemap;

namespace api.Services.Sitemap;

public class SitemapService : ISitemapService
{
    public Task<SitemapDiscoveryResult> DiscoverProductUrlsAsync(
        string sitemapUrl,
        string productUrlPattern,
        int maxDepth,
        int maxUrls,
        CancellationToken cancellationToken = default
    )
    {
        throw new NotImplementedException();
    }
}
