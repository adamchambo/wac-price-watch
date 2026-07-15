namespace api.Models;

public class StoreProductCategory
{
    public Guid StoreProductId { get; set; }

    public Guid ProductCategoryId { get; set; }

    public int Depth { get; set; }

    public StoreProduct? StoreProduct { get; set; }

    public ProductCategory? ProductCategory { get; set; }
}
