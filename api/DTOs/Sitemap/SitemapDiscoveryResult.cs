namespace api.DTOs.Sitemap;

public record SitemapDiscoveryResult(
    IReadOnlySet<string> ProductUrls,
    IReadOnlySet<string> VisitedSitemapUrls,
    IReadOnlySet<string> SkippedUrls,
    IReadOnlyList<string> Errors
);
