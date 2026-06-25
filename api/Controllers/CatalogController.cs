using Microsoft.AspNetCore.Mvc;
using api.Services.Catalog;
using api.DTOs.Catalog;
using api.Enums;

namespace api.Controllers;

[ApiController]
[Route("api/catalog")]
public class CatalogController : ControllerBase
{
    private readonly ICatalogService _catalogService;

    public CatalogController(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CatalogProductResponse>>> GetCatalogProducts(
        [FromQuery] Store store,
        [FromQuery] string? searchTerm,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default
    )
    {
        var products = await _catalogService.GetCatalogProductsAsync(
            store, 
            searchTerm, 
            page, 
            pageSize, 
            cancellationToken
        );

        return Ok(products);
    }

    [HttpGet("{productId:guid}")]
    public async Task<ActionResult<CatalogProductDetailsResponse>> GetCatalogProductDetail(
        [FromRoute] Guid productId,
        CancellationToken cancellationToken = default
    )
    {
        var product = await _catalogService.GetCatalogProductByIdAsync(
            productId, 
            cancellationToken
        );

        if (product == null) return NotFound();
        return Ok(product);
    }

}