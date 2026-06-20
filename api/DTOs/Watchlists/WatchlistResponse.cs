using api.Enums;

namespace api.DTOs.Watchlists;

public record WatchlistResponse(
    Guid Id,
    Store Store,
    string Name,
    IReadOnlyList<WatchlistItemResponse> Items
);
