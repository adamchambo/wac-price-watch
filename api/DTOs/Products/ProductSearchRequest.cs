using api.Enums;

namespace api.DTOs.Products;

public record ProductSearchRequest(
    Store Store,
    string? SearchTerm,
    int Page,
    int PageSize
);
