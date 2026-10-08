namespace BE.Validators
{
    public class ProductValidator
    {
        public List<string> ValidateStatus(string? status)
        {
            if (BE.Constants.ProductConstants.IsAllowedStatus(status))
                return new List<string>();

            return new List<string>
            {
                $"Status must be one of: {string.Join(", ", BE.Constants.ProductConstants.AllowedStatuses)}."
            };
        }
    }
}
