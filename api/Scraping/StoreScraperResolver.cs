using api.Scraping;
using api.Enums;

namespace api.Scraping;

public class StoreScraperResolver
{
    private readonly IEnumerable<IStoreScraper> _storeScrapers;

    public StoreScraperResolver(IEnumerable<IStoreScraper> storeScrapers)
    {
        _storeScrapers = storeScrapers;
    }

    public IStoreScraper Resolve(Store store)
    {
        return _storeScrapers.FirstOrDefault(scraper 
            => scraper.Store == store) ?? 
            throw new InvalidOperationException(
                $"No scraper registered for store: {store}"
            );
    }
}