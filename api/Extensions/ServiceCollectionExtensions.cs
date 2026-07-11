using System.Net.Http.Headers;
using api.Data;
using api.Options;
using api.Services.Catalog;
using api.Services.Scraping;
using api.Services.Sitemap;
using api.Services.UserSettings;
using api.Services.Watchlist;
using api.Scraping;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddControllers();
        services.AddOpenApi();
        services.AddHttpLogging();
        services.AddProblemDetails();

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services
            .AddIdentityApiEndpoints<IdentityUser>()
            .AddEntityFrameworkStores<AppDbContext>();

        services.Configure<CatalogSyncOptions>(
            configuration.GetSection("CatalogSync"));

        services.AddScoped<ICatalogService, CatalogService>();
        services.AddScoped<ICatalogSyncService, CatalogSyncService>();
        services.AddScoped<IWatchlistService, WatchlistService>();
        services.AddScoped<IWatchlistPriceCheckService, WatchlistPriceCheckService>();
        services.AddScoped<IUserSettingsService, UserSettingsService>();
        services.AddScoped<IProductScrapeService, ProductScrapeService>();

        services.AddSitemapServices();
        services.AddStoreScrapers();
        services.AddBackgroundJobs(configuration);
        services.AddFrontendCors();

        return services;
    }

    private static IServiceCollection AddFrontendCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("Frontend", policy =>
            {
                policy
                    .WithOrigins("http://localhost:3000")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        return services;
    }

    public static IServiceCollection AddBackgroundJobs(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("DefaultConnection is required for Hangfire.");

        services.AddHangfire(config =>
        {
            config.UsePostgreSqlStorage(options =>
            {
                options.UseNpgsqlConnection(connectionString);
            });
        });

        services.AddHangfireServer();

        return services;
    }

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
