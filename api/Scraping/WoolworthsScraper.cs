using System.Text.Json;
using api.DTOs.Scraping;
using api.Enums;
using api.Helpers;
using HtmlAgilityPack;

namespace api.Scraping;

public class WoolworthsScraper : IStoreScraper
{
    private readonly HttpClient _httpClient;

    public WoolworthsScraper(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public Store Store => Store.Woolworths;

    public async Task<ScrapedStoreProduct> ScrapeProductAsync(string productUrl)
    {
        var html = await _httpClient.GetStringAsync(productUrl);

        var document = new HtmlDocument();
        document.LoadHtml(html);

        var schemaJson = HtmlScrapingHelper.GetRequiredText(
            document,
            "//*[@id='pdp-schema' and @type='application/ld+json']",
            "Woolworths"
        );

        using var schemaDocument = JsonDocument.Parse(schemaJson);
        var product = schemaDocument.RootElement;
        var offers = HtmlScrapingHelper.GetRequiredJsonObject(product, "offers", "Woolworths");
        var brand = HtmlScrapingHelper.GetRequiredJsonObject(product, "brand", "Woolworths");

        var name = HtmlScrapingHelper.GetRequiredJsonString(product, "name", "Woolworths");
        var imageUrl = HtmlScrapingHelper.GetRequiredJsonString(product, "image", "Woolworths");
        var currentPrice = HtmlScrapingHelper.GetOptionalJsonDecimal(offers, "price");
        var availability = HtmlScrapingHelper.GetOptionalJsonString(offers, "availability");
        var categoryTrail = GetCategoryTrail(document, name);

        return new ScrapedStoreProduct(
            name,
            HtmlScrapingHelper.GetOptionalJsonString(brand, "name"),
            imageUrl,
            productUrl,
            HtmlScrapingHelper.GetOptionalJsonString(product, "sku"),
            categoryTrail,
            currentPrice,
            IsOnSpecial(document),
            availability?.Contains("InStock", StringComparison.OrdinalIgnoreCase) == true,
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
            .SelectNodes(
                "//*[contains(concat(' ', normalize-space(@class), ' '), ' breadcrumbs__item ') or @itemprop='name']"
            )
            ?.Select(node => HtmlEntity.DeEntitize(node.InnerText).Trim())
            .Where(value => IsWoolworthsCategoryCrumb(value, productName))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList()
            ?? [];
    }

    private static IReadOnlyList<string> GetCategoryTrailFromJsonLd(HtmlDocument document, string productName)
    {
        var schemaJson = HtmlScrapingHelper.GetOptionalText(
            document,
            "//*[@type='application/ld+json' and contains(., 'BreadcrumbList')]"
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
            .Where(value => IsWoolworthsCategoryCrumb(value, productName))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private static bool IsWoolworthsCategoryCrumb(string? value, string productName)
    {
        return !string.IsNullOrWhiteSpace(value)
            && !value.Equals("Home", StringComparison.OrdinalIgnoreCase)
            && !value.Equals("Shop", StringComparison.OrdinalIgnoreCase)
            && !value.Equals(productName, StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsOnSpecial(HtmlDocument document)
    {
        return document.DocumentNode.SelectSingleNode(
            "//*[contains(@class, 'product-label_component_special') or contains(@class, 'product-unit-price_component_price-was')]"
        ) is not null;
    }
}
