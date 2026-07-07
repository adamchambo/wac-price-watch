using System.Text.Json;
using api.DTOs.Scraping;
using api.Enums;
using api.Helpers;
using HtmlAgilityPack;

namespace api.Scraping;

public class ColesScraper : IStoreScraper
{
    private readonly HttpClient _httpClient;

    public ColesScraper(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public Store Store => Store.Coles;

    public async Task<ScrapedStoreProduct> ScrapeProductAsync(string productUrl)
    {
        var html = await _httpClient.GetStringAsync(productUrl);

        var document = new HtmlDocument();
        document.LoadHtml(html);

        var schemaJson = HtmlScrapingHelper.GetRequiredText(
            document,
            "//script[@type='application/ld+json' and contains(., 'Product') and contains(., 'offers')]",
            "Coles"
        );

        using var schemaDocument = JsonDocument.Parse(schemaJson);
        var product = schemaDocument.RootElement;
        var offers = HtmlScrapingHelper.GetRequiredJsonObjectOrFirstArrayObject(product, "offers", "Coles");
        var brand = HtmlScrapingHelper.GetRequiredJsonObject(product, "brand", "Coles");

        var name = HtmlScrapingHelper.GetRequiredJsonString(product, "name", "Coles");
        var imageUrl = HtmlScrapingHelper.GetRequiredJsonString(product, "image", "Coles");
        var currentPrice = HtmlScrapingHelper.GetOptionalJsonDecimal(offers, "price");
        var availability = HtmlScrapingHelper.GetOptionalJsonString(offers, "availability");

        return new ScrapedStoreProduct(
            name,
            HtmlScrapingHelper.GetOptionalJsonString(brand, "name"),
            imageUrl,
            productUrl,
            HtmlScrapingHelper.GetOptionalJsonValueAsString(product, "sku"),
            currentPrice,
            IsOnSpecial(document),
            availability?.Contains("InStock", StringComparison.OrdinalIgnoreCase) == true,
            DateTime.UtcNow
        );
    }

    private static bool IsOnSpecial(HtmlDocument document)
    {
        return document.DocumentNode.SelectSingleNode("//*[@data-testid='special-price' or @data-testid='save-price']")
            is not null;
    }
}
