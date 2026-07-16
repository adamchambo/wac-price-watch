using api.Enums;
using api.Services.Catalog;
using api.Services.Watchlist;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Scalar.AspNetCore;

namespace api.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication UseApplicationPipeline(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.MapScalarApiReference();
        }

        app.UseExceptionHandler();
        app.UseHttpsRedirection();
        app.UseHttpLogging();
        app.UseCors("Frontend");
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapIdentityApi<IdentityUser>();
        app.MapControllers();

        app.UseBackgroundJobs();

        return app;
    }

    public static WebApplication UseBackgroundJobs(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseHangfireDashboard("/hangfire");
        }

        var melbourneTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Australia/Melbourne");
        var midnightMelbourne = new RecurringJobOptions
        {
            TimeZone = melbourneTimeZone
        };

        var recurringJobs = app.Services.GetRequiredService<IRecurringJobManager>();

        recurringJobs.AddOrUpdate<ICatalogSyncService>(
            "catalog-sitemap-sync-coles",
            service => service.QueueCatalogSitemapSyncAsync(Store.Coles, CancellationToken.None),
            Cron.Daily(0, 0),
            midnightMelbourne
        );

        recurringJobs.AddOrUpdate<ICatalogSyncService>(
            "catalog-sitemap-sync-woolworths",
            service => service.QueueCatalogSitemapSyncAsync(Store.Woolworths, CancellationToken.None),
            Cron.Daily(0, 0),
            midnightMelbourne
        );

        recurringJobs.AddOrUpdate<IWatchlistPriceCheckService>(
            "watchlist-price-check-coles",
            service => service.QueueWatchlistPriceCheckAsync(Store.Coles, CancellationToken.None),
            Cron.Daily(0, 0),
            midnightMelbourne
        );

        recurringJobs.AddOrUpdate<IWatchlistPriceCheckService>(
            "watchlist-price-check-woolworths",
            service => service.QueueWatchlistPriceCheckAsync(Store.Woolworths, CancellationToken.None),
            Cron.Daily(0, 0),
            midnightMelbourne
        );

        recurringJobs.AddOrUpdate<IWatchlistPriceCheckService>(
            "watchlist-price-check-aldi",
            service => service.QueueWatchlistPriceCheckAsync(Store.Aldi, CancellationToken.None),
            Cron.Daily(0, 0),
            midnightMelbourne
        );

        return app;
    }
}
