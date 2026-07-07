namespace BE.Models.DTOs.Seller
{
    /// <summary>
    /// Seller registration progress.
    /// </summary>
    public class SellerRegistrationProgressDto
    {
        public int CurrentStep { get; set; }

        public int CompletedSteps { get; set; }

        public int TotalSteps { get; set; }

        public bool CanSubmit { get; set; }
    }
}