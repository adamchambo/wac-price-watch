using System.Net;
using api.Services.Sitemap;

namespace api.Tests.Sitemap;

public class SitemapServiceTests
{
    private const string AldiSitemapUrl = "https://www.aldi.com.au/sitemap.xml";
    private const string AldiCategoriesSitemapUrl = "https://www.aldi.com.au/sitemap_categories.xml";
    private const string AldiStoresSitemapUrl = "https://www.aldi.com.au/sitemap_stores.xml";

    private const string WoolworthsSitemapUrl = "https://www.woolworths.com.au/sitemap_index.xml";

    private const string ColesRootSitemapUrl = "https://www.coles.com.au/cusp-sitemap.xml";
    private const string ColesProductSitemapUrl = "https://www.coles.com.au/sitemap/sitemap-index-products.xml";
    private const string ColesBrandsSitemapUrl = "https://www.coles.com.au/sitemap/sitemap-brands.xml";
    private const string ColesSpecialsSitemapUrl = "https://www.coles.com.au/sitemap/sitemap-specials.xml";
    private const string ColesCategoriesSitemapUrl = "https://www.coles.com.au/sitemap/sitemap-categories.xml";
    private const string ColesStoresSitemapUrl = "https://www.coles.com.au/sitemap/sitemap-stores.xml";

    public static IEnumerable<object[]> ProductSitemapCases()
    {
        yield return new object[]
        {
            AldiSitemapUrl,
            "/product/",
            "https://www.aldi.com.au/product/ready-set-cook-pork-and-beef-meatballs-420g-000000000000399677"
        };

        yield return new object[]
        {
            WoolworthsSitemapUrl,
            "/shop/productdetails/",
            "https://www.woolworths.com.au/shop/productdetails/125122/giesen-sauvignon-blanc"
        };

        yield return new object[]
        {
            ColesProductSitemapUrl,
            "/product/",
            "https://www.coles.com.au/product/wicked-sister-high-protein-chocolate-pudding-170g-4494048"
        };
    }

    [Theory(Skip = "Live network sitemap smoke test. Unskip manually when checking retailer sitemaps.")]
    [MemberData(nameof(ProductSitemapCases))]
    public async Task DiscoverProductUrlsAsync_FollowsSitemapIndexAndFiltersProductUrls(
        string sitemapUrl,
        string productUrlPattern,
        string expectedProductUrl
    )
    {
        var childSitemapUrl = $"{sitemapUrl}.child.xml";
        using var httpClient = new HttpClient(
            new FakeSitemapHttpMessageHandler(
                new Dictionary<string, string>
                {
                    [sitemapUrl] = SitemapIndex(childSitemapUrl),
                    [childSitemapUrl] = UrlSet(
                        expectedProductUrl,
                        "https://example.com/not-a-product"
                    )
                }
            )
        );
        var service = new SitemapService(httpClient);

        var result = await service.DiscoverProductUrlsAsync(
            sitemapUrl,
            productUrlPattern,
            maxDepth: 2,
            maxUrls: 10
        );

        Assert.Contains(expectedProductUrl, result.ProductUrls);
        Assert.Contains(sitemapUrl, result.VisitedSitemapUrls);
        Assert.Contains(childSitemapUrl, result.VisitedSitemapUrls);
        Assert.Contains("https://example.com/not-a-product", result.SkippedUrls);
        Assert.Empty(result.Errors);
    }

    [Fact]
    public void RobotsTxtSitemapUrls_AreCapturedAsConstants()
    {
        var sitemapUrls = new[]
        {
            AldiCategoriesSitemapUrl,
            AldiSitemapUrl,
            AldiStoresSitemapUrl,
            WoolworthsSitemapUrl,
            ColesRootSitemapUrl,
            ColesProductSitemapUrl,
            ColesBrandsSitemapUrl,
            ColesSpecialsSitemapUrl,
            ColesCategoriesSitemapUrl,
            ColesStoresSitemapUrl
        };

        Assert.Contains("https://www.aldi.com.au/sitemap.xml", sitemapUrls);
        Assert.Contains("https://www.woolworths.com.au/sitemap_index.xml", sitemapUrls);
        Assert.Contains("https://www.coles.com.au/sitemap/sitemap-index-products.xml", sitemapUrls);
    }

    private static string SitemapIndex(string childSitemapUrl)
    {
        return $"""
            <?xml version="1.0" encoding="UTF-8"?>
            <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
              <sitemap>
                <loc>{childSitemapUrl}</loc>
              </sitemap>
            </sitemapindex>
            """;
    }

    private static string UrlSet(params string[] urls)
    {
        var urlElements = string.Join(
            Environment.NewLine,
            urls.Select(url => $"  <url><loc>{url}</loc></url>")
        );

        return $"""
            <?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            {urlElements}
            </urlset>
            """;
    }

    private sealed class FakeSitemapHttpMessageHandler : HttpMessageHandler
    {
        private readonly IReadOnlyDictionary<string, string> _responsesByUrl;

        public FakeSitemapHttpMessageHandler(IReadOnlyDictionary<string, string> responsesByUrl)
        {
            _responsesByUrl = responsesByUrl;
        }

        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken
        )
        {
            var requestUrl = request.RequestUri?.ToString();

            if (requestUrl is not null && _responsesByUrl.TryGetValue(requestUrl, out var xml))
            {
                return Task.FromResult(
                    new HttpResponseMessage(HttpStatusCode.OK)
                    {
                        Content = new StringContent(xml)
                    }
                );
            }

            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.NotFound));
        }
    }
}

public class SitemapServiceLiveTests
{
    public static IEnumerable<object[]> ProductSitemapCases()
    {
        yield return new object[]
        {
            "https://www.aldi.com.au/sitemap.xml",
            "/product/"
        };

        yield return new object[]
        {
            "https://www.woolworths.com.au/sitemap_index.xml",
            "/shop/productdetails/"
        };

        yield return new object[]
        {
            "https://www.coles.com.au/sitemap/sitemap-index-products.xml",
            "/product/"
        };
    }

    [Theory]
    [MemberData(nameof(ProductSitemapCases))]
    public async Task DiscoverProductUrlsAsync_ReturnsUpToFiftyProductUrls_FromLiveSitemap(
        string sitemapUrl,
        string productUrlPattern
    )
    {
        using var httpClient = CreateHttpClient();
        var service = new SitemapService(httpClient);

        var result = await service.DiscoverProductUrlsAsync(
            sitemapUrl,
            productUrlPattern,
            maxDepth: 3,
            maxUrls: 50
        );

        Assert.NotEmpty(result.ProductUrls);
        Assert.True(result.ProductUrls.Count <= 50);
        Assert.All(
            result.ProductUrls,
            url => Assert.Contains(productUrlPattern, url, StringComparison.OrdinalIgnoreCase)
        );
    }

    private static HttpClient CreateHttpClient()
    {
        var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.UserAgent.ParseAdd(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        );
        httpClient.DefaultRequestHeaders.Accept.ParseAdd(
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        );
        httpClient.DefaultRequestHeaders.AcceptLanguage.ParseAdd("en-AU,en;q=0.9");
        httpClient.DefaultRequestHeaders.CacheControl = new System.Net.Http.Headers.CacheControlHeaderValue
        {
            NoCache = true
        };

        return httpClient;
    }
}
