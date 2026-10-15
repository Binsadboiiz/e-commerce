using BE.Models.DTOs;

namespace BE.Validators
{
    public class CreateProductValidator
    {
        public List<string> Validate(CreateProductRequest request)
        {
            var errors = new List<string>();

            if (request == null)
            {
                errors.Add("Request cannot be null.");
                return errors;
            }

            if (string.IsNullOrWhiteSpace(request.Name))
            {
                errors.Add("Product name is required.");
            }

            if (request.Name?.Length > 200)
            {
                errors.Add("Product name cannot exceed 200 characters.");
            }

            if (request.Variants == null || !request.Variants.Any())
            {
                errors.Add("At least one variant is required.");
            }
            else
            {
                var seenSkus = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                var seenAttributeKeys = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

                for (int i = 0; i < request.Variants.Count; i++)
                {
                    var variant = request.Variants[i];

                    if (variant.Price <= 0)
                    {
                        errors.Add($"Variant #{i + 1} price must be greater than 0.");
                    }

                    if (variant.InitialStock < 0)
                    {
                        errors.Add($"Variant #{i + 1} initial stock cannot be negative.");
                    }

                    if (!string.IsNullOrWhiteSpace(variant.Sku))
                    {
                        var trimmedSku = variant.Sku.Trim();
                        if (seenSkus.Contains(trimmedSku))
                        {
                            errors.Add($"Duplicate SKU '{trimmedSku}' found in variant #{i + 1}.");
                        }
                        else
                        {
                            seenSkus.Add(trimmedSku);
                        }
                    }

                    if (variant.Attributes != null && variant.Attributes.Any())
                    {
                        var attrKey = string.Join("|", variant.Attributes
                            .Where(a => !string.IsNullOrWhiteSpace(a.Value))
                            .OrderBy(a => a.AttributeName ?? "")
                            .Select(a => $"{a.AttributeName?.Trim().ToLowerInvariant()}:{a.Value?.Trim().ToLowerInvariant()}"));

                        if (!string.IsNullOrEmpty(attrKey))
                        {
                            if (seenAttributeKeys.Contains(attrKey))
                            {
                                errors.Add($"Duplicate attribute combination found in variant #{i + 1}.");
                            }
                            else
                            {
                                seenAttributeKeys.Add(attrKey);
                            }
                        }
                    }
                }
            }

            return errors;
        }
    }
}