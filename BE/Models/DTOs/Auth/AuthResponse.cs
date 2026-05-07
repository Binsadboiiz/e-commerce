namespace BE.Models.DTOs.Auth
{
    public class AuthResponse
    {
        public string AccessToken { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public string UserId { get; set; }
    }
}