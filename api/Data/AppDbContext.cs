
using api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public class AppDbContext : IdentityDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

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
    public DbSet<ProductCategory> ProductCategories => Set<ProductCategory>();
    public DbSet<StoreProductCategory> StoreProductCategories => Set<StoreProductCategory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<StoreProduct>()
            .HasIndex(x => x.ProductUrl)
            .IsUnique();

        modelBuilder.Entity<ProductCategory>()
            .HasIndex(x => new { x.Store, x.ParentCategoryId, x.NormalizedName })
            .IsUnique();

        modelBuilder.Entity<StoreProductCategory>()
            .HasKey(x => new { x.StoreProductId, x.ProductCategoryId });

        modelBuilder.Entity<StoreProductCategory>()
            .HasIndex(x => new { x.StoreProductId, x.Depth })
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
