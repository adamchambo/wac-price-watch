using api.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using api.Services.Catalog;
using api.Services.Scraping;
using api.Services.Sitemap;
using api.Services.UserSettings;
using api.Services.Watchlist;
using api.Scraping;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<AppDbContext>();

builder.Services.AddScoped<ICatalogService, CatalogService>();
builder.Services.AddScoped<ICatalogSyncService, CatalogSyncService>();

builder.Services.AddScoped<IWatchlistService, WatchlistService>();
builder.Services.AddScoped<IWatchlistPriceCheckService, WatchlistPriceCheckService>();

// builder.Services.AddScoped<ISitemapService, SitemapService>();
builder.Services.AddScoped<IUserSettingsService, UserSettingsService>();

builder.Services.AddScoped<IProductScrapeService, ProductScrapeService>();

builder.Services.AddScoped<StoreScraperResolver>();

builder.Services.AddScoped<IStoreScraper, ColesScraper>();
builder.Services.AddScoped<IStoreScraper, WoolworthsScraper>();
builder.Services.AddScoped<IStoreScraper, AldiScraper>();


builder.Services.AddCors(options =>
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

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapIdentityApi<IdentityUser>();
app.MapControllers();

app.Run();