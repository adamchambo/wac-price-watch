using api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public class AppDbContext : IdentityDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<StoreProfile> StoreProfiles => Set<StoreProfile>();
    public DbSet<UserSettings> UserSettings => Set<UserSettings>();
    public DbSet<StoreProduct> StoreProducts => Set<StoreProduct>();
    public DbSet<Watchlist> Watchlists => Set<Watchlist>();
    public DbSet<WatchlistItem> WatchlistItems => Set<WatchlistItem>();
    public DbSet<WatchlistItemMatch> WatchlistItemMatches => Set<WatchlistItemMatch>();
    public DbSet<PriceSnapshot> PriceSnapshots => Set<PriceSnapshot>();
    public DbSet<ScrapeRun> ScrapeRuns => Set<ScrapeRun>();
    public DbSet<ScrapeTask> ScrapeTasks => Set<ScrapeTask>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<AlertRule> AlertRules => Set<AlertRule>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<StoreProfile>()
            .HasIndex(x => x.Store)
            .IsUnique();

        modelBuilder.Entity<StoreProfile>()
            .HasIndex(x => x.SitemapUrl)
            .IsUnique();

        modelBuilder.Entity<StoreProduct>()
            .HasIndex(x => x.ProductUrl)
            .IsUnique();

        modelBuilder.Entity<Watchlist>()
            .HasIndex(x => new { x.UserId, x.Store })
            .IsUnique();

        modelBuilder.Entity<WatchlistItem>()
            .HasIndex(x => new { x.WatchlistId, x.BaseStoreProductId })
            .IsUnique();

        modelBuilder.Entity<PriceSnapshot>()
            .HasIndex(x => new { x.StoreProductId, x.ScrapeRunId })
            .IsUnique();

        modelBuilder.Entity<ScrapeTask>()
            .HasIndex(x => new { x.ScrapeRunId, x.ProductUrl })
            .IsUnique();
    }
}
