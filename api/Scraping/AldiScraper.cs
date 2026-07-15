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

        var name = HtmlScrapingHelper.GetRequiredJsonString(product, "name", "Aldi");

        return new ScrapedStoreProduct(
            name,
            HtmlScrapingHelper.GetOptionalJsonString(brand, "name"),
            GetRequiredImageUrl(product),
            productUrl,
            ExtractSkuFromUrl(productUrl),
            GetCategoryTrail(document, name),
            HtmlScrapingHelper.ParseCurrency(priceText, "Aldi"),
            false,
            HtmlScrapingHelper.GetOptionalJsonString(offers, "availability")
                ?.Contains("InStock", StringComparison.OrdinalIgnoreCase) == true,
            DateTime.UtcNow
        );
    }

    private static IReadOnlyList<string> GetCategoryTrail(HtmlDocument document, string productName)
    {
        var jsonLdTrail = GetCategoryTrailFromJsonLd(document, productName);

        if (jsonLdTrail.Count > 0)
        {
            return jsonLdTrail;
        }

        return document.DocumentNode
            .SelectNodes("//*[contains(concat(' ', normalize-space(@class), ' '), ' breadcrumbs__item ')]")
            ?.Select(node => HtmlEntity.DeEntitize(node.InnerText).Trim())
            .Where(value => IsAldiCategoryCrumb(value, productName))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList()
            ?? [];
    }

    private static IReadOnlyList<string> GetCategoryTrailFromJsonLd(HtmlDocument document, string productName)
    {
        var schemaJson = HtmlScrapingHelper.GetOptionalText(
            document,
            "//script[@type='application/ld+json' and contains(., 'BreadcrumbList')]"
        );

        if (string.IsNullOrWhiteSpace(schemaJson))
        {
            return [];
        }

        using var schemaDocument = JsonDocument.Parse(schemaJson);
        var root = schemaDocument.RootElement;

        if (!root.TryGetProperty("itemListElement", out var items) || items.ValueKind != JsonValueKind.Array)
        {
            return [];
        }

        return items
            .EnumerateArray()
            .Select(item => HtmlScrapingHelper.GetOptionalJsonString(item, "name"))
            .OfType<string>()
            .Where(value => IsAldiCategoryCrumb(value, productName))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private static bool IsAldiCategoryCrumb(string? value, string productName)
    {
        return !string.IsNullOrWhiteSpace(value)
            && !value.Equals("Home", StringComparison.OrdinalIgnoreCase)
            && !value.Equals("Products", StringComparison.OrdinalIgnoreCase)
            && !value.Equals(productName, StringComparison.OrdinalIgnoreCase);
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
