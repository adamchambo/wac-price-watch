using System.Globalization;
using System.Text.Json;
using HtmlAgilityPack;

namespace api.Helpers;

public static class HtmlScrapingHelper
{
    public static string GetRequiredText(HtmlDocument document, string xPath, string sourceName)
    {
        var value = GetOptionalText(document, xPath);

        if (string.IsNullOrWhiteSpace(value))
        {
            throw new InvalidOperationException($"Required {sourceName} selector returned no text: {xPath}");
        }

        return value;
    }

    public static string? GetOptionalText(HtmlDocument document, string xPath)
    {
        var text = document.DocumentNode.SelectSingleNode(xPath)?.InnerText;

        return text is null
            ? null
            : HtmlEntity.DeEntitize(text).Trim();
    }

    public static string GetRequiredAttribute(
        HtmlDocument document,
        string xPath,
        string attributeName,
        string sourceName
    )
    {
        var value = GetOptionalAttribute(document, xPath, attributeName);

        if (string.IsNullOrWhiteSpace(value))
        {
            throw new InvalidOperationException(
                $"Required {sourceName} selector returned no {attributeName} attribute: {xPath}"
            );
        }

        return value;
    }

    public static string? GetOptionalAttribute(HtmlDocument document, string xPath, string attributeName)
    {
        return document.DocumentNode
            .SelectSingleNode(xPath)
            ?.GetAttributeValue(attributeName, string.Empty)
            ?.Trim();
    }

    public static decimal? ParseCurrency(string? priceText, string sourceName)
    {
        if (string.IsNullOrWhiteSpace(priceText))
        {
            return null;
        }

        var normalized = priceText.Replace("$", string.Empty).Trim();

        return decimal.TryParse(
            normalized,
            NumberStyles.Number,
            CultureInfo.InvariantCulture,
            out var price
        )
            ? price
            : throw new InvalidOperationException($"Could not parse {sourceName} price: {priceText}");
    }

    public static JsonElement GetRequiredJsonObject(JsonElement element, string propertyName, string sourceName)
    {
        if (!element.TryGetProperty(propertyName, out var value) || value.ValueKind != JsonValueKind.Object)
        {
            throw new InvalidOperationException($"Required {sourceName} JSON object missing: {propertyName}");
        }

        return value;
    }

    public static JsonElement GetRequiredJsonObjectOrFirstArrayObject(
        JsonElement element,
        string propertyName,
        string sourceName
    )
    {
        if (!element.TryGetProperty(propertyName, out var value))
        {
            throw new InvalidOperationException($"Required {sourceName} JSON object missing: {propertyName}");
        }

        if (value.ValueKind == JsonValueKind.Object)
        {
            return value;
        }

        if (value.ValueKind == JsonValueKind.Array)
        {
            var firstValue = value.EnumerateArray().FirstOrDefault();

            if (firstValue.ValueKind == JsonValueKind.Object)
            {
                return firstValue;
            }
        }

        throw new InvalidOperationException($"Required {sourceName} JSON object missing: {propertyName}");
    }

    public static string GetRequiredJsonString(JsonElement element, string propertyName, string sourceName)
    {
        var value = GetOptionalJsonString(element, propertyName);

        if (string.IsNullOrWhiteSpace(value))
        {
            throw new InvalidOperationException($"Required {sourceName} JSON string missing: {propertyName}");
        }

        return value;
    }

    public static string? GetOptionalJsonString(JsonElement element, string propertyName)
    {
        return element.TryGetProperty(propertyName, out var value) && value.ValueKind == JsonValueKind.String
            ? value.GetString()?.Trim()
            : null;
    }

    public static string? GetOptionalJsonValueAsString(JsonElement element, string propertyName)
    {
        if (!element.TryGetProperty(propertyName, out var value))
        {
            return null;
        }

        return value.ValueKind switch
        {
            JsonValueKind.String => value.GetString()?.Trim(),
            JsonValueKind.Number => value.GetRawText(),
            _ => null
        };
    }

    public static decimal? GetOptionalJsonDecimal(JsonElement element, string propertyName)
    {
        return element.TryGetProperty(propertyName, out var value) && value.ValueKind == JsonValueKind.Number
            ? value.GetDecimal()
            : null;
    }
}
