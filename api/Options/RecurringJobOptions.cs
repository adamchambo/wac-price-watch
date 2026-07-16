namespace api.Options;

public class RecurringJobScheduleOptions
{
    public string TimeZoneId { get; set; } = "Australia/Melbourne";

    public string CatalogSitemapSyncCron { get; set; } = "0 0 1 * *";

    public string CatalogSyncCron { get; set; } = "0 0 * * 0";
}
