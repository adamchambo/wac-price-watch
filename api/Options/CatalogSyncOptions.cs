namespace api.Options;

public class CatalogSyncOptions
{
    public Dictionary<string, CatalogSitemapOptions> Sitemaps { get; set; } = [];
}

public class CatalogSitemapOptions
{
    public string SitemapUrl { get; set; } = string.Empty;

    public string ProductUrlPattern { get; set; } = string.Empty;

    public int MaxDepth { get; set; } = 3;

    public int MaxUrls { get; set; } = 50;
}
