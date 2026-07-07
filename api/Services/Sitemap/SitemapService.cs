using api.DTOs.Sitemap;
using System.Xml.Linq;

namespace api.Services.Sitemap;

public class SitemapService : ISitemapService
{
    private readonly HttpClient _httpClient;

    public SitemapService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<SitemapDiscoveryResult> DiscoverProductUrlsAsync(
        string sitemapUrl,
        string productUrlPattern,
        int maxDepth,
        int maxUrls,
        CancellationToken cancellationToken = default
    )
    {
        var productUrls = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var visitedSitemapUrls = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var skippedUrls = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var errors = new List<string>();

        await DiscoverProductUrlsAsync(
            sitemapUrl,
            productUrlPattern,
            0,
            Math.Max(0, maxDepth),
            Math.Max(0, maxUrls),
            productUrls,
            visitedSitemapUrls,
            skippedUrls,
            errors,
            cancellationToken
        );

        return new SitemapDiscoveryResult(
            productUrls,
            visitedSitemapUrls,
            skippedUrls,
            errors
        );
    }

    private async Task DiscoverProductUrlsAsync(
        string sitemapUrl,
        string productUrlPattern,
        int currentDepth,
        int maxDepth,
        int maxUrls,
        HashSet<string> productUrls,
        HashSet<string> visitedSitemapUrls,
        HashSet<string> skippedUrls,
        List<string> errors,
        CancellationToken cancellationToken
    )
    {
        if (productUrls.Count >= maxUrls)
        {
            skippedUrls.Add(sitemapUrl);
            return;
        }

        if (currentDepth > maxDepth)
        {
            skippedUrls.Add(sitemapUrl);
            return;
        }

        if (!visitedSitemapUrls.Add(sitemapUrl))
        {
            return;
        }

        XDocument document;

        try
        {
            var xml = await _httpClient.GetStringAsync(sitemapUrl, cancellationToken);
            document = XDocument.Parse(xml);
        }
        catch (Exception exception) when (exception is HttpRequestException or TaskCanceledException or InvalidOperationException)
        {
            errors.Add($"Failed to load sitemap {sitemapUrl}: {exception.Message}");
            return;
        }

        var rootName = document.Root?.Name.LocalName;

        if (rootName == "sitemapindex")
        {
            foreach (var childSitemapUrl in GetLocValues(document))
            {
                await DiscoverProductUrlsAsync(
                    childSitemapUrl,
                    productUrlPattern,
                    currentDepth + 1,
                    maxDepth,
                    maxUrls,
                    productUrls,
                    visitedSitemapUrls,
                    skippedUrls,
                    errors,
                    cancellationToken
                );

                if (productUrls.Count >= maxUrls)
                {
                    break;
                }
            }

            return;
        }

        if (rootName == "urlset")
        {
            foreach (var url in GetLocValues(document))
            {
                if (productUrls.Count >= maxUrls)
                {
                    skippedUrls.Add(url);
                    continue;
                }

                if (IsProductUrl(url, productUrlPattern))
                {
                    productUrls.Add(url);
                }
                else
                {
                    skippedUrls.Add(url);
                }
            }

            return;
        }

        errors.Add($"Unsupported sitemap root element for {sitemapUrl}: {rootName ?? "none"}");
    }

    private static IEnumerable<string> GetLocValues(XDocument document)
    {
        return document
            .Descendants()
            .Where(element => element.Name.LocalName == "loc")
            .Select(element => element.Value.Trim())
            .Where(value => !string.IsNullOrWhiteSpace(value));
    }

    private static bool IsProductUrl(string url, string productUrlPattern)
    {
        return string.IsNullOrWhiteSpace(productUrlPattern)
            || url.Contains(productUrlPattern, StringComparison.OrdinalIgnoreCase);
    }
}
