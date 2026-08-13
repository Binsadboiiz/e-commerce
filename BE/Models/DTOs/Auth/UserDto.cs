namespace BE.Models.DTOs.Auth
{
    public class UserDto
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Avatar { get; set; }
        public string Role { get; set; }
    }
}
