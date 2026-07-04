using api.Enums;
using api.DTOs.Scraping;
namespace api.Scraping;

public interface IStoreScraper
{
    Store Store { get; }

    Task<ScrapedStoreProduct> ScrapeProductAsync(string productUrl);
}