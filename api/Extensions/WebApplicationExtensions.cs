using api.Enums;
using api.Services.Catalog;
using api.Services.Watchlist;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using api.Options;
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

        var scheduleOptions = app.Services
            .GetRequiredService<IOptions<RecurringJobScheduleOptions>>()
            .Value;

        var scheduleTimeZone = TimeZoneInfo.FindSystemTimeZoneById(scheduleOptions.TimeZoneId);
        var recurringJobOptions = new RecurringJobOptions
        {
            TimeZone = scheduleTimeZone
        };

        var recurringJobs = app.Services.GetRequiredService<IRecurringJobManager>();

        recurringJobs.RemoveIfExists("watchlist-price-check-coles");
        recurringJobs.RemoveIfExists("watchlist-price-check-woolworths");
        recurringJobs.RemoveIfExists("watchlist-price-check-aldi");

        recurringJobs.AddOrUpdate<ICatalogSyncService>(
            "catalog-sitemap-sync-coles",
            service => service.QueueCatalogSitemapSyncAsync(Store.Coles, CancellationToken.None),
            scheduleOptions.CatalogSitemapSyncCron,
            recurringJobOptions
        );

        recurringJobs.AddOrUpdate<ICatalogSyncService>(
            "catalog-sitemap-sync-woolworths",
            service => service.QueueCatalogSitemapSyncAsync(Store.Woolworths, CancellationToken.None),
            scheduleOptions.CatalogSitemapSyncCron,
            recurringJobOptions
        );

        recurringJobs.AddOrUpdate<ICatalogSyncService>(
            "catalog-sync-coles",
            service => service.QueueCatalogSyncAsync(Store.Coles, CancellationToken.None),
            scheduleOptions.CatalogSyncCron,
            recurringJobOptions
        );

        recurringJobs.AddOrUpdate<ICatalogSyncService>(
            "catalog-sync-woolworths",
            service => service.QueueCatalogSyncAsync(Store.Woolworths, CancellationToken.None),
            scheduleOptions.CatalogSyncCron,
            recurringJobOptions
        );

        return app;
    }
}
