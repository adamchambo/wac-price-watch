namespace api.DTOs.Watchlists;

public record AddWatchlistItemByUrlRequest(
    string ProductUrl,
    string? DisplayName
);
