using System.Net.Http.Headers;
using api.Services.Sitemap;
using api.Scraping;

namespace api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddStoreScrapers(this IServiceCollection services)
    {
        services.AddScoped<StoreScraperResolver>();

        services.AddHttpClient<IStoreScraper, ColesScraper>(ConfigureStoreScraperHttpClient);
        services.AddHttpClient<IStoreScraper, WoolworthsScraper>(ConfigureStoreScraperHttpClient);
        services.AddHttpClient<IStoreScraper, AldiScraper>(ConfigureStoreScraperHttpClient);

        return services;
    }

    public static IServiceCollection AddSitemapServices(this IServiceCollection services)
    {
        services.AddHttpClient<ISitemapService, SitemapService>(ConfigureStoreScraperHttpClient);

        return services;
    }

    private static void ConfigureStoreScraperHttpClient(HttpClient httpClient)
    {
        httpClient.DefaultRequestHeaders.UserAgent.ParseAdd(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        );
        httpClient.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("text/html")
        );
        httpClient.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/xhtml+xml")
        );
        httpClient.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/xml", 0.9)
        );
        httpClient.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("*/*", 0.8)
        );
        httpClient.DefaultRequestHeaders.AcceptLanguage.ParseAdd("en-AU,en;q=0.9");
        httpClient.DefaultRequestHeaders.CacheControl = new CacheControlHeaderValue
        {
            NoCache = true
        };
    }
}
