using api.DTOs.Sitemap;

namespace api.Services.Sitemap;

public interface ISitemapService
{
    Task<SitemapDiscoveryResult> DiscoverProductUrlsAsync(
        string sitemapUrl,
        string productUrlPattern,
        int maxDepth,
        int maxUrls,
        CancellationToken cancellationToken = default
    );
}
