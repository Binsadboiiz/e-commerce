using System.IdentityModel.Tokens.Jwt; 
using System.Security.Claims; 
using System.Text; 
using BE.Models.Entities; 
using Microsoft.IdentityModel.Tokens; 

namespace BE.Helpers
{
    public class JWTHelper
    {
        /// <summary>
        /// Hàm khởi tạo JSON Web Token dựa trên thông tin người dùng và cấu hình hệ thống.
        /// </summary>
        public static string GenerateToken(User user, IConfiguration config)
        {
            // 1. Khởi tạo danh sách các Claims 
            // Đây là các cặp Key-Value lưu trữ thông tin thực thể (User) trong Payload của Token.
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId), // Định danh duy nhất của người dùng
                new Claim(ClaimTypes.Email, user.Email),          // Email người dùng
                new Claim(ClaimTypes.Role, user.Role)             // Vai trò (Phân quyền)
            };

            // 2. Thiết lập Khóa bí mật (Secret Key)
            // Chuyển đổi chuỗi Key từ cấu hình thành mảng bytes để đưa vào thuật toán băm.
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(config["Jwt:Key"]));

            // 3. Khởi tạo Thông tin ký (Signing Credentials)
            // Sử dụng thuật toán HmacSha256 để ký số lên Token, đảm bảo tính toàn vẹn dữ liệu.
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // 4. Cấu hình các thành phần chính của JWT
            var token = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"],       // Bên phát hành Token (ví dụ: https://my-api.com)
                audience: config["Jwt:Audience"],   
                claims: claims,                    
                expires: DateTime.UtcNow.AddDays(3), // Thời gian hết hạn của Token
                signingCredentials: creds            // Chữ ký số bảo mật
            );

            // 5. Serialize Token
            // Chuyển đối tượng JwtSecurityToken thành một chuỗi string 
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}