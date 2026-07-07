using System.Text.Json;
using api.DTOs.Scraping;
using api.Enums;
using api.Helpers;
using HtmlAgilityPack;

namespace api.Scraping;

public class AldiScraper : IStoreScraper
{
    private readonly HttpClient _httpClient;

    public AldiScraper(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public Store Store => Store.Aldi;

    public async Task<ScrapedStoreProduct> ScrapeProductAsync(string productUrl)
    {
        var html = await _httpClient.GetStringAsync(productUrl);

        var document = new HtmlDocument();
        document.LoadHtml(html);

        var schemaJson = HtmlScrapingHelper.GetRequiredText(
            document,
            "//script[@type='application/ld+json' and contains(., '\"@type\":\"Product\"')]",
            "Aldi"
        );

        using var schemaDocument = JsonDocument.Parse(schemaJson);
        var product = schemaDocument.RootElement;
        var offers = HtmlScrapingHelper.GetRequiredJsonObject(product, "offers", "Aldi");
        var brand = HtmlScrapingHelper.GetRequiredJsonObject(product, "brand", "Aldi");
        var priceText = HtmlScrapingHelper.GetOptionalJsonString(offers, "price");

        return new ScrapedStoreProduct(
            HtmlScrapingHelper.GetRequiredJsonString(product, "name", "Aldi"),
            HtmlScrapingHelper.GetOptionalJsonString(brand, "name"),
            GetRequiredImageUrl(product),
            productUrl,
            ExtractSkuFromUrl(productUrl),
            HtmlScrapingHelper.ParseCurrency(priceText, "Aldi"),
            false,
            HtmlScrapingHelper.GetOptionalJsonString(offers, "availability")
                ?.Contains("InStock", StringComparison.OrdinalIgnoreCase) == true,
            DateTime.UtcNow
        );
    }

    private static string GetRequiredImageUrl(JsonElement product)
    {
        if (
            product.TryGetProperty("image", out var image)
            && image.ValueKind == JsonValueKind.Array
            && image.GetArrayLength() > 0
        )
        {
            return image[0].GetString()
                ?? throw new InvalidOperationException("Required Aldi image URL was empty.");
        }

        throw new InvalidOperationException("Required Aldi image array missing.");
    }

    private static string? ExtractSkuFromUrl(string productUrl)
    {
        var lastDashIndex = productUrl.LastIndexOf('-');

        return lastDashIndex >= 0
            ? productUrl[(lastDashIndex + 1)..]
            : null;
    }
}
