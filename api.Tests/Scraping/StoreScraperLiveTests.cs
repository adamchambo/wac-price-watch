using api.Enums;
using api.Scraping;

namespace api.Tests.Scraping;

public class StoreScraperLiveTests
{
    [Fact(Skip = "Live retailer page blocks automated requests or may change price.")]
    public async Task ScrapeProductAsync_ReturnsProductDetails_ForLiveWoolworthsProduct()
    {
        using var httpClient = CreateHttpClient();
        var scraper = new WoolworthsScraper(httpClient);

        var result = await scraper.ScrapeProductAsync(
            "https://www.woolworths.com.au/shop/productdetails/125122/giesen-sauvignon-blanc"
        );

        Assert.Equal(Store.Woolworths, scraper.Store);
        Assert.False(string.IsNullOrWhiteSpace(result.Name));
        Assert.False(string.IsNullOrWhiteSpace(result.ProductUrl));
        Assert.False(string.IsNullOrWhiteSpace(result.ImageUrl));
        Assert.False(string.IsNullOrWhiteSpace(result.StoreSku));
        Assert.Equal(15.00m, result.CurrentPrice);
        Assert.True(result.ScrapedAt <= DateTime.UtcNow);
    }

    [Fact(Skip = "Live retailer price may change.")]
    public async Task ScrapeProductAsync_ReturnsProductDetails_ForLiveAldiProduct()
    {
        using var httpClient = CreateHttpClient();
        var scraper = new AldiScraper(httpClient);

        var result = await scraper.ScrapeProductAsync(
            "https://www.aldi.com.au/product/ready-set-cook-pork-and-beef-meatballs-420g-000000000000399677"
        );

        Assert.Equal(Store.Aldi, scraper.Store);
        Assert.False(string.IsNullOrWhiteSpace(result.Name));
        Assert.False(string.IsNullOrWhiteSpace(result.ProductUrl));
        Assert.False(string.IsNullOrWhiteSpace(result.ImageUrl));
        Assert.False(string.IsNullOrWhiteSpace(result.StoreSku));
        Assert.Equal(4.79m, result.CurrentPrice);
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
