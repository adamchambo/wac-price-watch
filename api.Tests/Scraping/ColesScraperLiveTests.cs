using api.Enums;
using api.Scraping;

namespace api.Tests.Scraping;

public class ColesScraperLiveTests
{
    [Fact(Skip = "Live retailer page blocks automated requests in this environment.")]
    public async Task ScrapeProductAsync_ReturnsProductDetails_ForLiveColesProduct()
    {
        using var httpClient = CreateHttpClient();
        var scraper = new ColesScraper(httpClient);

        var result = await scraper.ScrapeProductAsync(
            "https://www.coles.com.au/product/wicked-sister-high-protein-chocolate-pudding-170g-4494048"
        );

        Assert.Equal(Store.Coles, scraper.Store);
        Assert.False(string.IsNullOrWhiteSpace(result.Name));
        Assert.False(string.IsNullOrWhiteSpace(result.ProductUrl));
        Assert.False(string.IsNullOrWhiteSpace(result.ImageUrl));
        Assert.False(string.IsNullOrWhiteSpace(result.StoreSku));
        Assert.Equal(3.30m, result.CurrentPrice);
        Assert.True(result.ScrapedAt <= DateTime.UtcNow);
    }

    private static HttpClient CreateHttpClient()
    {
        var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.UserAgent.ParseAdd(
            "Mozilla/5.0 (compatible; WacPriceWatchBot/1.0)"
        );

        return httpClient;
    }
}
