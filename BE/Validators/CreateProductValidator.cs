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
                foreach (var variant in request.Variants)
                {
                    if (variant.Price <= 0)
                    {
                        errors.Add("Variant price must be greater than 0.");
                    }

                    if (variant.InitialStock < 0)
                    {
                        errors.Add("Initial stock cannot be negative.");
                    }
                }
            }

            return errors;
        }
    }
}