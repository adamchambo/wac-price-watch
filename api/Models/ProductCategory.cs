using api.Enums;

namespace api.Models;

public class ProductCategory
{
    public Guid Id { get; set; }

    public Store Store { get; set; }

    public string Name { get; set; } = string.Empty;

    public string NormalizedName { get; set; } = string.Empty;

    public Guid? ParentCategoryId { get; set; }

    public ProductCategory? ParentCategory { get; set; }

    public List<ProductCategory> ChildCategories { get; set; } = [];

    public List<StoreProductCategory> StoreProductCategories { get; set; } = [];
}
