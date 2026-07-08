using api.Enums;
using api.Services.Catalog;
using api.Services.Watchlist;
using Hangfire;

namespace api.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication UseBackgroundJobs(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseHangfireDashboard("/hangfire");
        }

        RecurringJob.AddOrUpdate<ICatalogSyncService>(
            "catalog-sitemap-sync-coles",
            service => service.QueueCatalogSitemapSyncAsync(Store.Coles, CancellationToken.None),
            Cron.Daily
        );

        RecurringJob.AddOrUpdate<ICatalogSyncService>(
            "catalog-sitemap-sync-woolworths",
            service => service.QueueCatalogSitemapSyncAsync(Store.Woolworths, CancellationToken.None),
            Cron.Daily
        );

        RecurringJob.AddOrUpdate<IWatchlistPriceCheckService>(
            "watchlist-price-check-coles",
            service => service.QueueWatchlistPriceCheckAsync(Store.Coles, CancellationToken.None),
            Cron.Hourly
        );

        RecurringJob.AddOrUpdate<IWatchlistPriceCheckService>(
            "watchlist-price-check-woolworths",
            service => service.QueueWatchlistPriceCheckAsync(Store.Woolworths, CancellationToken.None),
            Cron.Hourly
        );

        RecurringJob.AddOrUpdate<IWatchlistPriceCheckService>(
            "watchlist-price-check-aldi",
            service => service.QueueWatchlistPriceCheckAsync(Store.Aldi, CancellationToken.None),
            Cron.Hourly
        );

        return app;
    }
}
