using System.IdentityModel.Tokens.Jwt; 
using System.Security.Claims; 
using System.Text; 
using BE.Models.Entities; 
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;

namespace BE.Helpers
{
    public class JWTHelper
    {

        private readonly IConfiguration _config;

        public JWTHelper(IConfiguration config)
        {
            _config = config;
        }
        /// <summary>
        /// Hàm khởi tạo JSON Web Token dựa trên thông tin người dùng và cấu hình hệ thống.
        /// </summary>
        public string GenerateToken(string userId, string email, string role)
        {
            // 1. Khởi tạo danh sách các Claims 
            // Đây là các cặp Key-Value lưu trữ thông tin thực thể (User) trong Payload của Token.
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId), // Định danh duy nhất của người dùng
                new Claim(ClaimTypes.Email, email),          // Email người dùng
                new Claim(ClaimTypes.Role, role)             // Vai trò (Phân quyền)
            };

            // 2. Thiết lập Khóa bí mật (Secret Key)
            // Chuyển đổi chuỗi Key từ cấu hình thành mảng bytes để đưa vào thuật toán băm.
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Secret"]));

            // 3. Khởi tạo Thông tin ký (Signing Credentials)
            // Sử dụng thuật toán HmacSha256 để ký số lên Token, đảm bảo tính toàn vẹn dữ liệu.
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // 4. Cấu hình các thành phần chính của JWT
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
            );

            // 5. Serialize Token
            // Chuyển đối tượng JwtSecurityToken thành một chuỗi string 
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}