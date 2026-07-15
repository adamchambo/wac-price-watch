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
        var categoryTrail = GetCategoryTrail(document);

        return new ScrapedStoreProduct(
            name,
            HtmlScrapingHelper.GetOptionalJsonString(brand, "name"),
            imageUrl,
            productUrl,
            HtmlScrapingHelper.GetOptionalJsonValueAsString(product, "sku"),
            categoryTrail,
            currentPrice,
            IsOnSpecial(document),
            availability?.Contains("InStock", StringComparison.OrdinalIgnoreCase) == true,
            DateTime.UtcNow
        );
    }

    private static IReadOnlyList<string> GetCategoryTrail(HtmlDocument document)
    {
        var jsonLdTrail = GetCategoryTrailFromJsonLd(document);

        if (jsonLdTrail.Count > 0)
        {
            return jsonLdTrail;
        }

        return document.DocumentNode
            .SelectNodes("//*[@data-testid='breadcrumbs']//*[@itemprop='name']")
            ?.Select(node => HtmlEntity.DeEntitize(node.InnerText).Trim())
            .Where(IsColesCategoryCrumb)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList()
            ?? [];
    }

    private static IReadOnlyList<string> GetCategoryTrailFromJsonLd(HtmlDocument document)
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
            .Where(IsColesCategoryCrumb)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private static bool IsColesCategoryCrumb(string? value)
    {
        return !string.IsNullOrWhiteSpace(value)
            && !value.Equals("Home", StringComparison.OrdinalIgnoreCase)
            && !value.Equals("All categories", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsOnSpecial(HtmlDocument document)
    {
        return document.DocumentNode.SelectSingleNode("//*[@data-testid='special-price' or @data-testid='save-price']")
            is not null;
    }
}
